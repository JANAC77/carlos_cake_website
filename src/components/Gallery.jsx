// src/components/Gallery.jsx
import { useState, useEffect } from 'react';
import { getGalleryImages } from '../firebase';
import { X } from 'lucide-react';

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedImage, setSelectedImage] = useState(null);
  const [filteredImages, setFilteredImages] = useState([]);

  useEffect(() => {
    fetchGalleryImages();
  }, []);

  useEffect(() => {
    filterImages();
  }, [selectedCategory, images]);

  const fetchGalleryImages = async () => {
    setLoading(true);
    const galleryImages = await getGalleryImages();
    // Get unique categories from images
    const uniqueCategories = ['all', ...new Set(galleryImages.map(img => img.categoryName).filter(Boolean))];
    setCategories(uniqueCategories);
    setImages(galleryImages);
    setLoading(false);
  };

  const filterImages = () => {
    if (selectedCategory === 'all') {
      setFilteredImages(images);
    } else {
      setFilteredImages(images.filter(img => img.categoryName === selectedCategory));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white pt-32 pb-24 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-['Outfit'] font-black text-gray-900 uppercase tracking-tighter mb-4">
            Our Sweet Gallery
          </h1>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Explore our delicious creations and get inspired for your next celebration
          </p>
        </div>

        {/* Category Filter */}
        {categories.length > 1 && (
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all capitalize ${
                  selectedCategory === category
                    ? 'bg-pink-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category === 'all' ? 'All' : category}
              </button>
            ))}
          </div>
        )}

        {/* Gallery Grid */}
        {filteredImages.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredImages.map((image, index) => (
              <div
                key={image.id || index}
                onClick={() => setSelectedImage(image)}
                className="group relative aspect-square rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-all duration-500"
              >
                <img
                  src={image.image}
                  alt={image.title || 'Gallery Image'}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  onError={(e) => { e.target.src = '/placeholder.png'; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <h3 className="font-bold text-lg">{image.title}</h3>
                    {image.categoryName && (
                      <p className="text-sm text-gray-200">{image.categoryName}</p>
                    )}
                  </div>
                </div>
                {image.featured && (
                  <div className="absolute top-3 right-3">
                    <span className="bg-yellow-400 text-yellow-800 text-xs px-2 py-1 rounded-full font-bold">
                       Featured
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-pink-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-['Outfit'] font-black text-gray-900 mb-2">No Images Found</h3>
            <p className="text-gray-500">Check back soon for our beautiful cake gallery!</p>
          </div>
        )}

        {/* Lightbox Modal */}
        {selectedImage && (
          <div
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-6 right-6 text-white hover:text-pink-400 transition-colors"
            >
              <X className="w-8 h-8" />
            </button>
            <div
              className="max-w-5xl w-full max-h-[90vh] overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedImage.image}
                alt={selectedImage.title}
                className="w-full h-auto rounded-2xl"
              />
              <div className="mt-4 text-white text-center">
                <h2 className="text-2xl font-bold">{selectedImage.title}</h2>
                <p className="text-gray-300 mt-2">{selectedImage.description}</p>
                {selectedImage.categoryName && (
                  <p className="text-sm text-pink-400 mt-2">Category: {selectedImage.categoryName}</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Gallery;