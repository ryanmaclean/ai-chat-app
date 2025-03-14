import React, { useEffect, useState } from 'react';
import { getHighlighter } from 'shiki';

const ShikiHighlighter = ({ language, children, ...props }) => {
  const [highlightedCode, setHighlightedCode] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Sanitize inputs to prevent XSS
  const sanitizedLanguage = language ? language.replace(/[^\w-]/g, '') : 'text';
  const codeContent = typeof children === 'string' ? children : '';

  useEffect(() => {
    const highlightCode = async () => {
      try {
        const highlighter = await getHighlighter({
          theme: 'github-dark',
          langs: [sanitizedLanguage, 'javascript', 'typescript', 'jsx', 'tsx', 'html', 'css', 'json', 'markdown', 'text']
        });

        // Use a fallback language if the specified one isn't available
        const availableLang = highlighter.getLoadedLanguages().includes(sanitizedLanguage) 
          ? sanitizedLanguage 
          : 'text';

        const html = highlighter.codeToHtml(codeContent, { lang: availableLang });
        setHighlightedCode(html);
      } catch (error) {
        console.error('Error highlighting code:', error);
        // Fallback to plain text
        setHighlightedCode(`<pre class="shiki-fallback"><code>${escapeHtml(codeContent)}</code></pre>`);
      } finally {
        setIsLoading(false);
      }
    };

    highlightCode();
  }, [sanitizedLanguage, codeContent]);

  if (isLoading) {
    return <div className="code-loading">Loading code...</div>;
  }

  return (
    <div 
      className="shiki-wrapper"
      style={{
        borderRadius: '0.375rem',
        overflow: 'hidden',
      }}
      dangerouslySetInnerHTML={{ __html: highlightedCode }}
      {...props}
    />
  );
};

// Helper function to escape HTML
function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export default ShikiHighlighter; 