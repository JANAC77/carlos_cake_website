// src/firebase.js
import { initializeApp } from "firebase/app";
import {
    getAuth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    updateProfile,
    confirmPasswordReset,
    verifyPasswordResetCode
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

const API_BASE_URL = 'https://carlos-cake-admin.onrender.com';

export const sanitizeItemImages = (item) => {
    if (!item) return item;
    if (item.image && item.image.startsWith('/api/')) {
        item.image = `${API_BASE_URL}${item.image}`;
    }
    if (item.url && item.url.startsWith('/api/')) {
        item.url = `${API_BASE_URL}${item.url}`;
    }
    return item;
};

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

        let products = snapshot.docs.map(doc => sanitizeItemImages({ id: doc.id, ...doc.data() }));

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
            return sanitizeItemImages({ id: docSnap.id, ...docSnap.data() });
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

        let products = snapshot.docs.map(doc => sanitizeItemImages({ id: doc.id, ...doc.data() }));
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
        const categories = snapshot.docs.map(doc => sanitizeItemImages({ id: doc.id, ...doc.data() }));

        // Virtualize "Design Cakes" category if not returned by Firestore
        const hasDesignCakes = categories.some(cat => cat.id === 'H0Lfi1ddap5ingjHPsuo' || cat.name?.toLowerCase().includes('design'));
        if (!hasDesignCakes) {
            categories.push({
                id: 'H0Lfi1ddap5ingjHPsuo',
                name: 'Design Cakes',
                status: 'active',
                image: 'https://carlos-cake-admin.onrender.com/api/image/6a05d1bf95f68d0e213ddee6',
                imageId: '6a05d1bf95f68d0e213ddee6',
                description: 'Crafted for every celebration with custom designs and rich flavours'
            });
        }

        return categories;
    } catch (error) {
        console.error("Error getting categories:", error);
        // Return design cakes virtual category anyway as a fallback
        return [
            {
                id: 'H0Lfi1ddap5ingjHPsuo',
                name: 'Design Cakes',
                status: 'active',
                image: 'https://carlos-cake-admin.onrender.com/api/image/6a05d1bf95f68d0e213ddee6',
                imageId: '6a05d1bf95f68d0e213ddee6',
                description: 'Crafted for every celebration with custom designs and rich flavours'
            }
        ];
    }
};

export const getCategoryById = async (id) => {
    try {
        if (id === 'H0Lfi1ddap5ingjHPsuo') {
            return {
                id: 'H0Lfi1ddap5ingjHPsuo',
                name: 'Design Cakes',
                status: 'active',
                image: 'https://carlos-cake-admin.onrender.com/api/image/6a05d1bf95f68d0e213ddee6',
                imageId: '6a05d1bf95f68d0e213ddee6',
                description: 'Crafted for every celebration with custom designs and rich flavours'
            };
        }
        const docRef = doc(db, 'categories', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return sanitizeItemImages({ id: docSnap.id, ...docSnap.data() });
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

        // Update product stock
        if (orderData.items && Array.isArray(orderData.items)) {
            for (const item of orderData.items) {
                if (item.id) {
                    try {
                        const productRef = doc(db, 'products', item.id);
                        const productSnap = await getDoc(productRef);
                        if (productSnap.exists()) {
                            const productData = productSnap.data();
                            const orderQty = Number(item.quantity) || 1;
                            const updates = { updatedAt: serverTimestamp() };

                            // Update weight options stock if weightOptions are present
                            if (productData.weightOptions && Array.isArray(productData.weightOptions) && item.selectedWeight) {
                                const updatedWeightOptions = productData.weightOptions.map(opt => {
                                    if (String(opt.weight).trim() === String(item.selectedWeight.weight).trim()) {
                                        const currentStock = opt.stock !== undefined && opt.stock !== null && opt.stock !== '' ? Number(opt.stock) : 0;
                                        return {
                                            ...opt,
                                            stock: Math.max(0, currentStock - orderQty)
                                        };
                                    }
                                    return opt;
                                });
                                updates.weightOptions = updatedWeightOptions;

                                // Recalculate overall stock as the sum of all weight options' stocks
                                const totalStock = updatedWeightOptions.reduce((sum, opt) => {
                                    const optStock = opt.stock !== undefined && opt.stock !== null && opt.stock !== '' ? Number(opt.stock) : 0;
                                    return sum + optStock;
                                }, 0);
                                updates.stock = totalStock;
                                updates.quantity = totalStock;
                            } else {
                                if (productData.stock !== undefined && productData.stock !== null) {
                                    updates.stock = Math.max(0, Number(productData.stock) - orderQty);
                                }
                                if (productData.quantity !== undefined && productData.quantity !== null) {
                                    updates.quantity = Math.max(0, Number(productData.quantity) - orderQty);
                                }
                                // If neither is present, default to stock
                                if (updates.stock === undefined && updates.quantity === undefined) {
                                    updates.stock = Math.max(0, 0 - orderQty);
                                }
                            }

                            await updateDoc(productRef, updates);
                            console.log(`Updated stock for product ${item.id}:`, updates);
                        }
                    } catch (stockError) {
                        console.error(`Error updating stock for product ${item.id}:`, stockError);
                    }
                }
            }
        }

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

export const logPaymentError = async (errorData) => {
    try {
        await addDoc(collection(db, 'payment_logs'), {
            ...errorData,
            createdAt: new Date().toISOString()
        });
        return { success: true };
    } catch (e) {
        console.error("Error logging payment error:", e);
        return { success: false };
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

export { onAuthStateChanged, confirmPasswordReset, verifyPasswordResetCode };

// Add these functions to your website's firebase.js

// Get products by occasion
export const getProductsByOccasion = async (occasion) => {
    try {
        const productsRef = collection(db, 'products');
        const q = query(productsRef, where('occasions', 'array-contains', occasion), where('status', '==', 'active'));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => sanitizeItemImages({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error("Error getting products by occasion:", error);
        return [];
    }
};

// Submit custom cake request
export const submitCustomCakeRequest = async (requestData) => {
    try {
        const docRef = await addDoc(collection(db, 'customCakeRequests'), {
            ...requestData,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        });
        return { success: true, id: docRef.id };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

// Get available time slots
export const getAvailableTimeSlots = async (date) => {
    try {
        const slotsRef = collection(db, 'timeSlots');
        const q = query(slotsRef, where('date', '==', date));
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
            return ['9:00 AM - 11:00 AM', '11:00 AM - 1:00 PM', '1:00 PM - 3:00 PM', '3:00 PM - 5:00 PM', '5:00 PM - 7:00 PM', '7:00 PM - 9:00 PM'];
        }

        return snapshot.docs[0].data().slots;
    } catch (error) {
        console.error("Error getting time slots:", error);
        return [];
    }
};

// Get holiday dates
export const getHolidayDates = async () => {
    try {
        const holidaysRef = collection(db, 'holidays');
        const snapshot = await getDocs(holidaysRef);
        return snapshot.docs.map(doc => ({ id: doc.id, date: doc.data().date }));
    } catch (error) {
        return [];
    }
};

// Get order tracking
export const getOrderTracking = async (orderId) => {
    try {
        const orderRef = doc(db, 'orders', orderId);
        const orderSnap = await getDoc(orderRef);

        if (!orderSnap.exists()) return null;

        const order = orderSnap.data();
        return {
            currentStatus: order.status,
            statusHistory: order.statusHistory || [],
            estimatedDeliveryTime: order.deliveryTimeSlot,
            deliveryDate: order.deliveryDate
        };
    } catch (error) {
        console.error("Error getting order tracking:", error);
        return null;
    }
};

export const getAddOns = async () => {
    try {
        const addOnsRef = collection(db, 'addOns');
        const q = query(addOnsRef, where('status', '==', 'active'));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => sanitizeItemImages({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error("Error getting add-ons:", error);
        return [];
    }
};

// Add these functions to your website's firebase.js

// ============ ORDER CANCELLATION FUNCTIONS ============

// Cancel order by user
export const cancelOrder = async (orderId, reason = '') => {
    try {
        const orderRef = doc(db, 'orders', orderId);
        const orderSnap = await getDoc(orderRef);

        if (!orderSnap.exists()) {
            return { success: false, error: 'Order not found' };
        }

        const order = orderSnap.data();

        // Check if order can be cancelled
        const orderDate = order.createdAt?.toDate?.() || new Date(order.createdAt);
        const hoursSinceOrder = (new Date() - orderDate) / (1000 * 60 * 60);

        // Check cancellation eligibility
        if (order.status === 'delivered') {
            return { success: false, error: 'Cannot cancel delivered orders' };
        }

        if (order.status === 'cancelled') {
            return { success: false, error: 'Order already cancelled' };
        }

        if (order.status === 'processing' && hoursSinceOrder > 2) {
            return { success: false, error: 'Order is already being processed. Please contact support.' };
        }

        // Update order status
        const statusHistory = order.statusHistory || [];
        statusHistory.push({
            status: 'cancelled',
            timestamp: new Date().toISOString(),
            reason: reason,
            cancelledBy: 'user'
        });

        // Restore product stock
        if (order.items && Array.isArray(order.items)) {
            for (const item of order.items) {
                if (item.id) {
                    try {
                        const productRef = doc(db, 'products', item.id);
                        const productSnap = await getDoc(productRef);
                        if (productSnap.exists()) {
                            const productData = productSnap.data();
                            const orderQty = Number(item.quantity) || 1;
                            const updates = { updatedAt: serverTimestamp() };

                            // Restore weight options stock if weightOptions are present
                            if (productData.weightOptions && Array.isArray(productData.weightOptions) && item.selectedWeight) {
                                const updatedWeightOptions = productData.weightOptions.map(opt => {
                                    if (String(opt.weight).trim() === String(item.selectedWeight.weight).trim()) {
                                        const currentStock = opt.stock !== undefined && opt.stock !== null && opt.stock !== '' ? Number(opt.stock) : 0;
                                        return {
                                            ...opt,
                                            stock: currentStock + orderQty
                                        };
                                    }
                                    return opt;
                                });
                                updates.weightOptions = updatedWeightOptions;

                                // Recalculate overall stock as the sum of all weight options' stocks
                                const totalStock = updatedWeightOptions.reduce((sum, opt) => {
                                    const optStock = opt.stock !== undefined && opt.stock !== null && opt.stock !== '' ? Number(opt.stock) : 0;
                                    return sum + optStock;
                                }, 0);
                                updates.stock = totalStock;
                                updates.quantity = totalStock;
                            } else {
                                if (productData.stock !== undefined && productData.stock !== null) {
                                    updates.stock = Number(productData.stock) + orderQty;
                                }
                                if (productData.quantity !== undefined && productData.quantity !== null) {
                                    updates.quantity = Number(productData.quantity) + orderQty;
                                }
                                if (updates.stock === undefined && updates.quantity === undefined) {
                                    updates.stock = orderQty;
                                }
                            }

                            await updateDoc(productRef, updates);
                            console.log(`Restored stock for product ${item.id}:`, updates);
                        }
                    } catch (stockError) {
                        console.error(`Error restoring stock for product ${item.id}:`, stockError);
                    }
                }
            }
        }

        await updateDoc(orderRef, {
            status: 'cancelled',
            cancelledAt: serverTimestamp(),
            cancellationReason: reason,
            statusHistory: statusHistory,
            updatedAt: serverTimestamp()
        });

        return { success: true, message: 'Order cancelled successfully' };

    } catch (error) {
        console.error("Error cancelling order:", error);
        return { success: false, error: error.message };
    }
};

// Check if order can be cancelled
export const canCancelOrder = async (orderId) => {
    try {
        const orderRef = doc(db, 'orders', orderId);
        const orderSnap = await getDoc(orderRef);

        if (!orderSnap.exists()) {
            return { canCancel: false, reason: 'Order not found' };
        }

        const order = orderSnap.data();
        const orderDate = order.createdAt?.toDate?.() || new Date(order.createdAt);
        const hoursSinceOrder = (new Date() - orderDate) / (1000 * 60 * 60);

        if (order.status === 'delivered') {
            return { canCancel: false, reason: 'Order already delivered' };
        }

        if (order.status === 'cancelled') {
            return { canCancel: false, reason: 'Order already cancelled' };
        }

        if (order.status === 'processing' && hoursSinceOrder > 2) {
            return { canCancel: false, reason: 'Order is being processed, cannot cancel' };
        }

        return { canCancel: true };

    } catch (error) {
        return { canCancel: false, reason: error.message };
    }
};

// Get all active occasions (ONLY from Firebase)
export const getOccasions = async () => {
    try {
        const occasionsRef = collection(db, 'occasions');
        const q = query(occasionsRef, where('status', '==', 'active'));
        const snapshot = await getDocs(q);

        let occasions = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Sort by order
        occasions.sort((a, b) => (a.order || 0) - (b.order || 0));

        return occasions;  // Returns empty array if no data
    } catch (error) {
        console.error("Error getting occasions:", error);
        return [];  // Only return empty array, no static data
    }
};

// Get add-ons by occasion name (ONLY from Firebase)
export const getAddOnsByOccasion = async (occasionName) => {
    try {
        const addOnsRef = collection(db, 'addOns');
        const q = query(addOnsRef, where('occasions', 'array-contains', occasionName), where('status', '==', 'active'));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error("Error getting add-ons by occasion:", error);
        return [];
    }
};

// Remove orderBy that requires index
export const getMenuCategories = async () => {
    try {
        const categoriesRef = collection(db, 'menuCategories');
        const q = query(categoriesRef, where('status', '==', 'active'));
        const snapshot = await getDocs(q);
        // Sort in JavaScript instead of Firestore
        let categories = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        categories.sort((a, b) => (a.order || 0) - (b.order || 0));
        return categories;
    } catch (error) {
        console.error("Error getting menu categories:", error);
        return [];
    }
};

// Similarly for getMenuItems if needed
export const getMenuItems = async (categoryId = null) => {
    try {
        let constraints = [where('status', '==', 'active')];
        if (categoryId) {
            constraints.push(where('categoryId', '==', categoryId));
        }
        const itemsRef = collection(db, 'menuItems');
        const q = query(itemsRef, ...constraints);
        const snapshot = await getDocs(q);
        let items = snapshot.docs.map(doc => sanitizeItemImages({ id: doc.id, ...doc.data() }));
        // Sort by name or price in JavaScript
        items.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
        return items;
    } catch (error) {
        console.error("Error getting menu items:", error);
        return [];
    }
};

export const getGalleryImages = async () => {
    try {
        const galleryRef = collection(db, 'gallery');
        // Only filter by status - no orderBy
        const q = query(galleryRef, where('status', '==', 'active'));
        const snapshot = await getDocs(q);

        // Get categories for mapping
        const categories = await getCategories();

        let images = snapshot.docs.map(doc => {
            const data = doc.data();
            const category = categories.find(c => c.id === data.categoryId);
            return sanitizeItemImages({
                id: doc.id,
                ...data,
                categoryName: category?.name || 'Uncategorized',
                categoryIcon: category?.image || null
            });
        });

        // Sort in JavaScript
        images.sort((a, b) => {
            // Featured first
            if (a.featured && !b.featured) return -1;
            if (!a.featured && b.featured) return 1;
            // Then by date (newest first)
            const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(0);
            const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(0);
            return dateB - dateA;
        });

        return images;
    } catch (error) {
        console.error("Error getting gallery images:", error);
        return [];
    }
};

// Get featured gallery images for homepage - WITHOUT orderBy
export const getFeaturedGalleryImages = async (limit = 6) => {
    try {
        const galleryRef = collection(db, 'gallery');
        // Filter by status and featured
        const q = query(
            galleryRef,
            where('status', '==', 'active'),
            where('featured', '==', true)
        );
        const snapshot = await getDocs(q);

        const categories = await getCategories();

        let images = snapshot.docs.map(doc => {
            const data = doc.data();
            const category = categories.find(c => c.id === data.categoryId);
            return sanitizeItemImages({
                id: doc.id,
                ...data,
                categoryName: category?.name || 'Uncategorized'
            });
        });

        // Sort by date (newest first) and limit
        images.sort((a, b) => {
            const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(0);
            const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(0);
            return dateB - dateA;
        });

        return images.slice(0, limit);
    } catch (error) {
        console.error("Error getting featured gallery images:", error);
        return [];
    }
};

// ============ OFFER FUNCTIONS FOR WEBSITE ============
export const getActiveOffers = async () => {
    try {
        const offersRef = collection(db, 'offers');
        // Only filter by status - no orderBy
        const q = query(offersRef, where('status', '==', 'active'));
        const snapshot = await getDocs(q);

        let offers = snapshot.docs.map(doc => sanitizeItemImages({
            id: doc.id,
            ...doc.data()
        }));

        // Sort in JavaScript instead of Firestore
        offers.sort((a, b) => {
            const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(0);
            const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(0);
            return dateB - dateA;
        });

        return offers;
    } catch (error) {
        console.error("Error getting active offers:", error);
        return [];
    }
};
// Increment offer click count
export const incrementOfferClick = async (offerId) => {
    try {
        const offerRef = doc(db, 'offers', offerId);
        const offerSnap = await getDoc(offerRef);
        const currentClicks = offerSnap.data()?.clicks || 0;
        await updateDoc(offerRef, {
            clicks: currentClicks + 1
        });
        return { success: true };
    } catch (error) {
        console.error("Error incrementing click:", error);
        return { success: false };
    }
};

// src/firebase.js - Add this function

// Get products that have active offers
export const getProductsWithOffers = async () => {
    try {
        const productsRef = collection(db, 'products');
        const q = query(productsRef, where('status', '==', 'active'), where('isAvailable', '==', true));
        const snapshot = await getDocs(q);

        const today = new Date().toISOString().split('T')[0];

        let products = snapshot.docs.map(doc => sanitizeItemImages({ id: doc.id, ...doc.data() }));

        // Filter products with active offers
        const productsWithOffers = products.filter(product => {
            if (!product.hasOffer) return false;
            if (product.offerValidTill && product.offerValidTill < today) return false;
            return true;
        });

        // Sort by offer validity (ending soon first)
        productsWithOffers.sort((a, b) => {
            if (!a.offerValidTill) return 1;
            if (!b.offerValidTill) return -1;
            return new Date(a.offerValidTill) - new Date(b.offerValidTill);
        });

        return productsWithOffers;
    } catch (error) {
        console.error("Error getting products with offers:", error);
        return [];
    }
};

// Add to customer firebase.js
export const getActiveBanners = async () => {
    try {
        const bannersRef = collection(db, 'banners');
        const q = query(bannersRef, where('status', '==', 'active'));
        const snapshot = await getDocs(q);
        let banners = snapshot.docs.map(doc => sanitizeItemImages({ id: doc.id, ...doc.data() }));
        banners.sort((a, b) => (a.order || 0) - (b.order || 0));
        return banners;
    } catch (error) {
        console.error("Error getting active banners:", error);
        return [];
    }
};

// Get active banners by type (no index needed)
export const getBannersByType = async (type) => {
    try {
        const bannersRef = collection(db, 'banners');
        const q = query(bannersRef, where('status', '==', 'active'));
        const snapshot = await getDocs(q);

        let allBanners = snapshot.docs.map(doc => sanitizeItemImages({ id: doc.id, ...doc.data() }));

        // Filter by type in JavaScript
        let filteredBanners = allBanners.filter(banner => banner.type === type);

        // Sort by order
        filteredBanners.sort((a, b) => (a.order || 0) - (b.order || 0));

        return filteredBanners;
    } catch (error) {
        console.error("Error getting banners by type:", error);
        return [];
    }
};
export default app;