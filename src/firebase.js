// src/firebase.js (for your main cake shop website)
import { initializeApp } from "firebase/app";
import {
    getAuth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    updateProfile
} from "firebase/auth";
import {
    getFirestore,
    collection,
    getDocs,
    getDoc,
    doc,
    query,
    where,
    orderBy,
    limit,
    addDoc,
    updateDoc,
    serverTimestamp
} from "firebase/firestore";
import { getStorage, ref, getDownloadURL } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyAfclcscjwaYKfQEeDWSIr0Heh1Jbgpbcw",
    authDomain: "carlos-cake.firebaseapp.com",
    projectId: "carlos-cake",
    storageBucket: "carlos-cake.firebasestorage.app",
    messagingSenderId: "371510186232",
    appId: "1:371510186232:web:135d6a82384714d49d6b0d",
    measurementId: "G-40N4182W9W"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// ============ AUTH FUNCTIONS ============
export const loginWithEmail = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return { success: true, user: userCredential.user };
    } catch (error) {
        let errorMessage = "Login failed";
        switch (error.code) {
            case 'auth/invalid-email':
                errorMessage = "Invalid email address";
                break;
            case 'auth/user-disabled':
                errorMessage = "This account has been disabled";
                break;
            case 'auth/user-not-found':
                errorMessage = "No account found with this email";
                break;
            case 'auth/wrong-password':
                errorMessage = "Incorrect password";
                break;
            case 'auth/too-many-requests':
                errorMessage = "Too many failed attempts. Please try again later";
                break;
            default:
                errorMessage = error.message;
        }
        return { success: false, error: errorMessage };
    }
};

export const registerWithEmail = async (name, email, password) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName: name });

        // Save user to Firestore
        await addDoc(collection(db, 'users'), {
            uid: userCredential.user.uid,
            name: name,
            email: email,
            createdAt: serverTimestamp(),
            role: 'user'
        });

        return { success: true, user: userCredential.user };
    } catch (error) {
        let errorMessage = "Registration failed";
        switch (error.code) {
            case 'auth/email-already-in-use':
                errorMessage = "Email already in use";
                break;
            case 'auth/invalid-email':
                errorMessage = "Invalid email address";
                break;
            case 'auth/weak-password':
                errorMessage = "Password should be at least 6 characters";
                break;
            default:
                errorMessage = error.message;
        }
        return { success: false, error: errorMessage };
    }
};

export const logoutUser = async () => {
    try {
        await signOut(auth);
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

export { onAuthStateChanged };

// ============ PRODUCTS ============
export const getProducts = async (categoryId = null, subCategoryId = null) => {
    try {
        let productsRef = collection(db, 'products');
        let constraints = [];

        if (categoryId) {
            constraints.push(where('categoryId', '==', categoryId));
        }
        if (subCategoryId) {
            constraints.push(where('subCategoryId', '==', subCategoryId));
        }
        constraints.push(where('status', '==', 'active'));
        constraints.push(orderBy('createdAt', 'desc'));

        const q = query(productsRef, ...constraints);
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error("Error getting products:", error);
        return [];
    }
};

export const getProductById = async (id) => {
    try {
        const docRef = doc(db, 'products', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() };
        }
        return null;
    } catch (error) {
        console.error("Error getting product:", error);
        return null;
    }
};

export const getFeaturedProducts = async () => {
    try {
        const productsRef = collection(db, 'products');

        // First try with index (will work after index is created)
        try {
            const q = query(
                productsRef,
                where('status', '==', 'active'),
                where('isAvailable', '==', true),
                orderBy('createdAt', 'desc'),
                limit(6)
            );
            const snapshot = await getDocs(q);
            const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            // Ensure each product has required fields
            return products.map(product => ({
                ...product,
                price: product.price || 0,
                image: product.image || '/placeholder.png',
                category: product.categoryName || product.category || 'Cake'
            }));
        } catch (indexError) {
            console.warn("Index not ready, using fallback query:", indexError);

            // Fallback: fetch all and filter client-side
            const q = query(
                productsRef,
                where('status', '==', 'active')
            );
            const snapshot = await getDocs(q);
            let products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            // Filter and sort client-side
            products = products.filter(p => p.isAvailable === true);
            products = products.sort((a, b) => {
                const dateA = a.createdAt?.toDate?.() || new Date(0);
                const dateB = b.createdAt?.toDate?.() || new Date(0);
                return dateB - dateA;
            });
            products = products.slice(0, 6);

            return products.map(product => ({
                ...product,
                price: product.price || 0,
                image: product.image || '/placeholder.png',
                category: product.categoryName || product.category || 'Cake'
            }));
        }
    } catch (error) {
        console.error("Error getting featured products:", error);
        return [];
    }
};
// ============ CATEGORIES ============
export const getCategories = async () => {
    try {
        const categoriesRef = collection(db, 'categories');
        const q = query(categoriesRef, where('status', '==', 'active')); const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error("Error getting categories:", error);
        return [];
    }
};

export const getCategoryById = async (id) => {
    try {
        const docRef = doc(db, 'categories', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() };
        }
        return null;
    } catch (error) {
        console.error("Error getting category:", error);
        return null;
    }
};

// ============ SUBCATEGORIES ============
export const getSubCategories = async (categoryId = null) => {
    try {
        let constraints = [where('status', '==', 'active'), orderBy('name', 'asc')];
        if (categoryId) {
            constraints.push(where('categoryId', '==', categoryId));
        }
        const subCategoriesRef = collection(db, 'subCategories');
        const q = query(subCategoriesRef, ...constraints);
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error("Error getting subcategories:", error);
        return [];
    }
};

// ============ ORDERS ============
export const createOrder = async (orderData) => {
    try {
        const docRef = await addDoc(collection(db, 'orders'), {
            ...orderData,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        });
        return { success: true, id: docRef.id };
    } catch (error) {
        console.error("Error creating order:", error);
        return { success: false, error: error.message };
    }
};
export const getUserOrders = async (userId) => {
    try {
        const ordersRef = collection(db, 'orders');
        const q = query(ordersRef, where('userId', '==', userId), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error("Error getting user orders:", error);
        return [];
    }
};

export default app;