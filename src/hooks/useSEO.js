import { useEffect } from 'react';

/**
 * Custom hook to dynamically manage page title and meta description tags.
 * @param {Object} params
 * @param {string} params.title - Page title
 * @param {string} params.description - Meta description
 */
export function useSEO({ title, description }) {
  useEffect(() => {
    if (title) {
      document.title = title;
    }

    if (description) {
      let metaDescription = document.querySelector('meta[name="description"]');
      if (!metaDescription) {
        metaDescription = document.createElement('meta');
        metaDescription.name = 'description';
        document.head.appendChild(metaDescription);
      }
      metaDescription.setAttribute('content', description);
    }
  }, [title, description]);
}
