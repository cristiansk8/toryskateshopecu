'use client';
import { useEffect } from 'react';

const InstagramFeed = () => {
  useEffect(() => {
    const existingScript = document.getElementById('taggbox-script');
    if (!existingScript) {
      const script = document.createElement('script');
      script.src = 'https://widget.taggbox.com/embed.min.js';
      script.type = 'text/javascript';
      script.id = 'taggbox-script';
      document.body.appendChild(script);
    }
  }, []);

  return (
    <div
      className="taggbox"
      data-widget-id="295003"
      data-website="1" // 👈 Aquí el cambio clave
      style={{ width: '100%', height: '100%', overflow: 'auto' }}
    ></div>
  );
};

export default InstagramFeed;
