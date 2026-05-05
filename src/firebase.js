// src/firebase.js
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
    addDoc,
    orderBy,
    updateDoc,
    serverTimestamp,
    setDoc
} from "firebase/firestore";
import { getStorage } from "firebase/storage";

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

        const userData = {
            uid: userCredential.user.uid,
            name: name,
            email: email,
            phoneNumber: '',
            address: '',
            city: '',
            pincode: '',
            role: 'user',
            status: 'active',
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            totalOrders: 0,
            totalSpent: 0
        };

        await setDoc(doc(db, 'users', userCredential.user.uid), userData);
        await setDoc(doc(db, 'user', userCredential.user.uid), userData);

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

// ============ USER FUNCTIONS ============

export const getUserById = async (userId) => {
    try {
        const userRef = doc(db, 'users', userId);
        let userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            return { id: userSnap.id, ...userSnap.data() };
        }

        const userRef2 = doc(db, 'user', userId);
        userSnap = await getDoc(userRef2);

        if (userSnap.exists()) {
            return { id: userSnap.id, ...userSnap.data() };
        }

        return null;
    } catch (error) {
        console.error("Error getting user:", error);
        return null;
    }
};

export const syncUserDocument = async (user) => {
    try {
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
            const userData = {
                uid: user.uid,
                name: user.displayName || user.email.split('@')[0],
                email: user.email,
                phoneNumber: user.phoneNumber || '',
                address: '',
                city: '',
                pincode: '',
                role: 'user',
                status: 'active',
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
                totalOrders: 0,
                totalSpent: 0
            };

            await setDoc(userRef, userData);
            await setDoc(doc(db, 'user', user.uid), userData);
        }
        return { success: true };
    } catch (error) {
        console.error("Error syncing user:", error);
        return { success: false, error: error.message };
    }
};

export const updateUserInFirestore = async (userId, userData) => {
    try {
        const userRef = doc(db, 'users', userId);
        await updateDoc(userRef, {
            ...userData,
            updatedAt: serverTimestamp()
        });

        const userRef2 = doc(db, 'user', userId);
        await updateDoc(userRef2, {
            ...userData,
            updatedAt: serverTimestamp()
        });

        return { success: true };
    } catch (error) {
        console.error("Error updating user:", error);
        return { success: false, error: error.message };
    }
};

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
        
        const q = query(productsRef, ...constraints);
        const snapshot = await getDocs(q);
        
        let products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        // Sort manually by createdAt
        products.sort((a, b) => {
            const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt || 0);
            const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt || 0);
            return dateB - dateA;
        });
        
        return products;
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
        const q = query(productsRef, where('status', '==', 'active'));
        const snapshot = await getDocs(q);
        
        let products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        products = products.filter(p => p.isAvailable === true);
        
        products.sort((a, b) => {
            const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt || 0);
            const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt || 0);
            return dateB - dateA;
        });
        
        products = products.slice(0, 6);
        
        return products.map(product => ({
            ...product,
            price: product.price || 0,
            image: product.image || '/placeholder.png',
            category: product.categoryName || product.category || 'Cake'
        }));
    } catch (error) {
        console.error("Error getting featured products:", error);
        return [];
    }
};

// ============ CATEGORIES ============
export const getCategories = async () => {
    try {
        const categoriesRef = collection(db, 'categories');
        const q = query(categoriesRef, where('status', '==', 'active'));
        const snapshot = await getDocs(q);
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
        let constraints = [where('status', '==', 'active')];
        if (categoryId) {
            constraints.push(where('categoryId', '==', categoryId));
        }
        
        const subCategoriesRef = collection(db, 'subCategories');
        const q = query(subCategoriesRef, ...constraints);
        const snapshot = await getDocs(q);
        
        let subCategories = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        subCategories.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
        
        return subCategories;
    } catch (error) {
        console.error("Error getting subcategories:", error);
        return [];
    }
};

// ============ ORDERS FUNCTIONS - ALL EXPORTS HERE ============

export const createOrder = async (orderData) => {
    try {
        const order = {
            ...orderData,
            orderId: `ORD${Date.now()}${Math.floor(Math.random() * 1000)}`,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            status: 'pending'
        };
        
        const docRef = await addDoc(collection(db, 'orders'), order);
        console.log("Order created with ID:", docRef.id);

        if (orderData.userId && orderData.userId !== 'guest') {
            try {
                const userRef = doc(db, 'users', orderData.userId);
                const userSnap = await getDoc(userRef);
                
                if (userSnap.exists()) {
                    const user = userSnap.data();
                    await updateDoc(userRef, {
                        totalOrders: (user.totalOrders || 0) + 1,
                        totalSpent: (user.totalSpent || 0) + (orderData.total || 0),
                        updatedAt: serverTimestamp()
                    });
                }
            } catch (userError) {
                console.error("Error updating user stats:", userError);
            }
        }
        
        return { success: true, id: docRef.id };
    } catch (error) {
        console.error("Error creating order:", error);
        return { success: false, error: error.message };
    }
};

export const getUserOrders = async (userId) => {
    try {
        if (!userId) return [];
        
        const ordersRef = collection(db, 'orders');
        const q = query(ordersRef, where('userId', '==', userId));
        const snapshot = await getDocs(q);
        
        let orders = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : 
                          (data.createdAt ? new Date(data.createdAt) : new Date())
            };
        });
        
        orders.sort((a, b) => {
            const dateA = a.createdAt instanceof Date ? a.createdAt : new Date(a.createdAt);
            const dateB = b.createdAt instanceof Date ? b.createdAt : new Date(b.createdAt);
            return dateB - dateA;
        });
        
        return orders;
    } catch (error) {
        console.error("Error getting user orders:", error);
        return [];
    }
};

export const getUserOrdersByEmail = async (email) => {
    try {
        if (!email) return [];
        
        const ordersRef = collection(db, 'orders');
        const q = query(ordersRef, where('customerEmail', '==', email));
        const snapshot = await getDocs(q);
        
        let orders = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : 
                          (data.createdAt ? new Date(data.createdAt) : new Date())
            };
        });
        
        orders.sort((a, b) => {
            const dateA = a.createdAt instanceof Date ? a.createdAt : new Date(a.createdAt);
            const dateB = b.createdAt instanceof Date ? b.createdAt : new Date(b.createdAt);
            return dateB - dateA;
        });
        
        return orders;
    } catch (error) {
        console.error("Error getting orders by email:", error);
        return [];
    }
};

export const getUserOrdersList = async (userId) => {
    return getUserOrders(userId);
};

// ============ REVIEWS FUNCTIONS ============

export const addReview = async (productId, userId, userName, rating, comment) => {
    try {
        const reviewData = {
            productId: productId,
            userId: userId,
            userName: userName,
            rating: Number(rating),
            comment: comment,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            status: 'active'
        };
        
        const docRef = await addDoc(collection(db, 'reviews'), reviewData);
        
        // Update product average rating
        await updateProductRating(productId);
        
        return { success: true, id: docRef.id };
    } catch (error) {
        console.error("Error adding review:", error);
        return { success: false, error: error.message };
    }
};

export const getProductReviews = async (productId) => {
    try {
        if (!productId) return [];
        
        const reviewsRef = collection(db, 'reviews');
        // Only filter by productId
        const q = query(reviewsRef, where('productId', '==', productId));
        const snapshot = await getDocs(q);
        
        const reviews = snapshot.docs
            .map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    ...data,
                    createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date()
                };
            })
            .filter(review => review.status === 'active') // Filter status client-side
            .sort((a, b) => b.createdAt - a.createdAt); // Sort client-side
        
        return reviews;
    } catch (error) {
        console.error("Error getting reviews:", error);
        return [];
    }
};

export const updateProductRating = async (productId) => {
    try {
        const reviews = await getProductReviews(productId);
        
        if (reviews.length === 0) return;
        
        const totalRating = reviews.reduce((sum, review) => sum + (review.rating || 0), 0);
        const averageRating = totalRating / reviews.length;
        const ratingCount = reviews.length;
        
        const productRef = doc(db, 'products', productId);
        await updateDoc(productRef, {
            averageRating: averageRating,
            ratingCount: ratingCount,
            updatedAt: serverTimestamp()
        });
        
        return { success: true };
    } catch (error) {
        console.error("Error updating product rating:", error);
        return { success: false, error: error.message };
    }
};

export const getUserReviewForProduct = async (productId, userId) => {
    try {
        if (!productId || !userId) return null;
        
        const reviewsRef = collection(db, 'reviews');
        const q = query(
            reviewsRef,
            where('productId', '==', productId),
            where('userId', '==', userId),
            where('status', '==', 'active')
        );
        const snapshot = await getDocs(q);
        
        if (!snapshot.empty) {
            const doc = snapshot.docs[0];
            const data = doc.data();
            return { 
                id: doc.id, 
                ...data,
                createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date()
            };
        }
        return null;
    } catch (error) {
        console.error("Error getting user review:", error);
        return null;
    }
};

export default app;