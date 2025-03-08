import { useEffect } from 'react';

interface HelmetProps {
  title: string;
  description: string;
  image?: string;
  url?: string;
}

export const Helmet: React.FC<HelmetProps> = ({
  title,
  description,
  image = '/social-preview.jpg',
  url,
}) => {
  useEffect(() => {
    document.title = title;

    const metaTags = {
      description: description,
      'og:title': title,
      'og:description': description,
      'og:image': image,
      'og:url': url || window.location.href,
      'twitter:title': title,
      'twitter:description': description,
      'twitter:image': image,
    };

    Object.entries(metaTags).forEach(([name, content]) => {
      let element: HTMLMetaElement | null = null;

      if (name === 'description') {
        element = document.querySelector(`meta[name="${name}"]`);
      } else {
        element = document.querySelector(`meta[property="${name}"]`);
        if (!element) {
          element = document.querySelector(`meta[name="${name}"]`);
        }
      }

      if (element) {
        element.setAttribute(name.includes('og:') ? 'property' : 'name', name);
        element.setAttribute('content', content);
      } else {
        element = document.createElement('meta');
        element.setAttribute(name.includes('og:') ? 'property' : 'name', name);
        element.setAttribute('content', content);
        document.head.appendChild(element);
      }
    });

    return () => {
      document.title = 'Ramillete Espiritual';
    };
  }, [title, description, image, url]);

  return null;
};
