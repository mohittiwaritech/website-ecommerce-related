import { db } from '../firebase';
import {
  collection,
  getDocs,
  getDoc,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  setDoc,
  writeBatch,
  query,
  where,
  orderBy
} from 'firebase/firestore';



export const getProducts = async () => {
  try {
    const productsCol = collection(db, 'products');
    const q = query(productsCol, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
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
    console.error(`Error fetching product ${id}:`, error);
    throw error;
  }
};

export const saveProduct = async (product) => {
  try {
    const productData = {
      ...product,
      price: Number(product.price) || 0,
      oldPrice: Number(product.oldPrice) || 0,
      rating: Number(product.rating) || 5,
      inStock: product.inStock !== false,
      updatedAt: new Date().toISOString()
    };
    if (!productData.createdAt) {
      productData.createdAt = new Date().toISOString();
    }

    if (product.id) {
      const docRef = doc(db, 'products', product.id);
      await setDoc(docRef, productData, { merge: true });
      return product.id;
    } else {
      const docRef = collection(db, 'products');
      const docSnap = await addDoc(docRef, productData);
      return docSnap.id;
    }
  } catch (error) {
    console.error("Error saving product:", error);
    throw error;
  }
};

export const deleteProduct = async (id) => {
  try {
    const docRef = doc(db, 'products', id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
};



export const getCategories = async () => {
  try {
    const categoriesCol = collection(db, 'categories');
    const snapshot = await getDocs(categoriesCol);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

export const saveCategory = async (category) => {
  try {
    const categoryData = {
      ...category,
      updatedAt: new Date().toISOString()
    };
    if (!categoryData.createdAt) {
      categoryData.createdAt = new Date().toISOString();
    }

    if (category.id) {
      const docRef = doc(db, 'categories', String(category.id));
      await setDoc(docRef, categoryData, { merge: true });
      return category.id;
    } else {
      const docRef = collection(db, 'categories');
      const docSnap = await addDoc(docRef, categoryData);
      return docSnap.id;
    }
  } catch (error) {
    console.error("Error saving category:", error);
    throw error;
  }
};

export const deleteCategory = async (id) => {
  try {
    const docRef = doc(db, 'categories', id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error deleting category:", error);
    throw error;
  }
};



export const getDrivers = async () => {
  try {
    const driversCol = collection(db, 'drivers');
    const q = query(driversCol, orderBy('createdAt', 'asc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching drivers:", error);
    throw error;
  }
};

export const saveDriver = async (driver) => {
  try {
    const driverData = {
      ...driver,
      updatedAt: new Date().toISOString()
    };
    if (!driverData.createdAt) {
      driverData.createdAt = new Date().toISOString();
    }

    if (driver.id) {
      const docRef = doc(db, 'drivers', String(driver.id));
      await setDoc(docRef, driverData, { merge: true });
      return driver.id;
    } else {
      const docRef = collection(db, 'drivers');
      const docSnap = await addDoc(docRef, driverData);
      return docSnap.id;
    }
  } catch (error) {
    console.error("Error saving driver:", error);
    throw error;
  }
};

export const deleteDriver = async (id) => {
  try {
    const docRef = doc(db, 'drivers', id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error deleting driver:", error);
    throw error;
  }
};



export const getOrders = async () => {
  try {
    const ordersCol = collection(db, 'orders');
    const q = query(ordersCol, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
};

export const updateOrderStatus = async (orderId, status) => {
  try {
    const docRef = doc(db, 'orders', orderId);
    await updateDoc(docRef, { status, updatedAt: new Date().toISOString() });
  } catch (error) {
    console.error(`Error updating order ${orderId}:`, error);
    throw error;
  }
};



export const getContactMessages = async () => {
  try {
    const messagesCol = collection(db, 'contactMessages');
    const q = query(messagesCol, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching contact messages:", error);
    throw error;
  }
};



export const seedInitialDatabase = async (products, categories, drivers) => {
  try {
    const batch = writeBatch(db);
    const timestamp = new Date().toISOString();

    // 1. Seed Products
    products.forEach((prod) => {
      const docRef = doc(db, 'products', String(prod.id));
      batch.set(docRef, {
        sku: prod.sku || `SKU-${prod.id}`,
        brand: prod.brand || 'ATPOS',
        category: prod.category || 'Uncategorized',
        title: prod.title || '',
        rating: Number(prod.rating) || 5,
        price: Number(prod.price) || 0,
        oldPrice: Number(prod.oldPrice) || 0,
        mainImage: prod.mainImage || '',
        thumbnails: prod.thumbnails || [],
        shortDesc: prod.shortDesc || [],
        longDescription: prod.longDescription || '',
        videoUrl: prod.videoUrl || '',
        specs: prod.specs || {},
        warranty: prod.warranty || '1 Year Warranty',
        inStock: prod.inStock !== false,
        featured: ['4', '8', '9', '11'].includes(String(prod.id)), // Mark default featured products
        createdAt: timestamp,
        updatedAt: timestamp
      });
    });

    // 2. Seed Categories
    categories.forEach((cat) => {
      const docRef = doc(db, 'categories', String(cat.id));
      batch.set(docRef, {
        name: cat.name,
        image: cat.image || '',
        createdAt: timestamp,
        updatedAt: timestamp
      });
    });

    // 3. Seed Drivers
    drivers.forEach((drv) => {
      const docRef = doc(db, 'drivers', String(drv.id));
      batch.set(docRef, {
        name: drv.name,
        image: drv.image || '',
        desc: drv.desc || '',
        links: drv.links || [],
        createdAt: timestamp,
        updatedAt: timestamp
      });
    });

    await batch.commit();
    console.log("Seeding complete successfully!");
    return true;
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  }
};

export const getProductReviews = async (productId) => {
  try {
    const reviewsCol = collection(db, 'reviews');
    const q = query(reviewsCol, where('productId', '==', String(productId)));
    const snapshot = await getDocs(q);
    const reviews = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return reviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } catch (error) {
    console.error("Error fetching reviews:", error);
    throw error;
  }
};

export const addReview = async (reviewData) => {
  try {
    const reviewsCol = collection(db, 'reviews');
    const docSnap = await addDoc(reviewsCol, {
      ...reviewData,
      createdAt: new Date().toISOString()
    });
    return docSnap.id;
  } catch (error) {
    console.error("Error adding review:", error);
    throw error;
  }
};
