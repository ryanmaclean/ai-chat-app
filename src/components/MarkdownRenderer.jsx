import React from 'react'
import ReactMarkdown from 'react-markdown'
import ShikiHighlighter from './ShikiHighlighter'

const MarkdownRenderer = ({ content }) => {
  return (
    <ReactMarkdown
      components={{
        code({ node, inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || '')
          return !inline && match ? (
            <ShikiHighlighter
              language={match[1]}
              {...props}
            >
              {String(children).replace(/\n$/, '')}
            </ShikiHighlighter>
          ) : (
            <code className={className} {...props}>
              {children}
            </code>
          )
        }
      }}
    >
      {content}
    </ReactMarkdown>
  )
}

export default MarkdownRenderer
