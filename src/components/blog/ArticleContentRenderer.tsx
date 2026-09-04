"use client";

import React, { useMemo } from 'react';
import { Lightbulb, Sparkles, HelpCircle, CheckCircle2, Bookmark, Quote, Info } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface Block {
  type: 'h2' | 'h3' | 'paragraph' | 'ul' | 'ol' | 'callout' | 'quote';
  id?: string;
  text?: string;
  items?: string[];
  calloutType?: 'tip' | 'takeaway' | 'note' | 'fact';
  title?: string;
}

interface ArticleContentRendererProps {
  content: string;
  onHeadingsExtracted?: (headings: TocItem[]) => void;
}

// Utility to generate a clean slug ID for headings
const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .trim()
    .replace(/ +/g, '-');
};

// Heuristic parser for raw text and Markdown
export const parseContentToBlocks = (rawContent: string): { blocks: Block[]; headings: TocItem[] } => {
  if (!rawContent || !rawContent.trim()) {
    return { blocks: [], headings: [] };
  }

  const headings: TocItem[] = [];
  const blocks: Block[] = [];

  // Normalize newlines
  const cleanContent = rawContent.replace(/\r\n/g, '\n').trim();

  // If content contains double linebreaks or markdown headings, split by paragraphs/sections first
  let rawSections: string[] = [];

  if (cleanContent.includes('\n\n') || cleanContent.includes('## ') || cleanContent.includes('# ')) {
    rawSections = cleanContent.split(/\n\s*\n/).filter((s) => s.trim().length > 0);
  } else {
    // Single continuous block of text (like raw unformatted strings)
    // We split on known heading patterns or sentence groups
    rawSections = splitUnstructuredText(cleanContent);
  }

  rawSections.forEach((section) => {
    const trimmed = section.trim();
    if (!trimmed) return;

    // 1. Markdown H2: ## Heading
    if (trimmed.startsWith('## ')) {
      const titleText = trimmed.replace(/^##\s+/, '').replace(/\*+/g, '').trim();
      const id = slugify(titleText);
      headings.push({ id, text: titleText, level: 2 });
      blocks.push({ type: 'h2', id, text: titleText });
      return;
    }

    // 2. Markdown H3: ### Heading
    if (trimmed.startsWith('### ')) {
      const titleText = trimmed.replace(/^###\s+/, '').replace(/\*+/g, '').trim();
      const id = slugify(titleText);
      headings.push({ id, text: titleText, level: 3 });
      blocks.push({ type: 'h3', id, text: titleText });
      return;
    }

    // 3. Markdown H1 treated as H2: # Heading
    if (trimmed.startsWith('# ')) {
      const titleText = trimmed.replace(/^#\s+/, '').replace(/\*+/g, '').trim();
      const id = slugify(titleText);
      headings.push({ id, text: titleText, level: 2 });
      blocks.push({ type: 'h2', id, text: titleText });
      return;
    }

    // 4. Callout / Tip / Key Takeaway Detection
    const calloutMatch = trimmed.match(/^(Tip|Pro Tip|Key Takeaways?|Note|Fun Fact|Did You Know\??):?\s*(.*)/i);
    if (calloutMatch) {
      const keyword = calloutMatch[1].toLowerCase();
      const bodyText = calloutMatch[2].trim() || trimmed;
      let cType: 'tip' | 'takeaway' | 'note' | 'fact' = 'tip';
      if (keyword.includes('takeaway')) cType = 'takeaway';
      else if (keyword.includes('fact') || keyword.includes('know')) cType = 'fact';
      else if (keyword.includes('note')) cType = 'note';

      blocks.push({
        type: 'callout',
        calloutType: cType,
        title: calloutMatch[1].toUpperCase(),
        text: bodyText,
      });
      return;
    }

    // 5. Blockquote / Quote
    if (trimmed.startsWith('> ')) {
      const quoteText = trimmed.replace(/^>\s+/, '').trim();
      blocks.push({ type: 'quote', text: quoteText });
      return;
    }

    // 6. Bullet Lists (Markdown - or * or line-by-line bullets or inline •)
    if (trimmed.includes('•') || trimmed.match(/^[\-\*]\s+/m) || trimmed.match(/^\d+\.\s+/m)) {
      let listItems: string[] = [];

      if (trimmed.includes('•')) {
        // Inline or multiline bullets with '•'
        listItems = trimmed
          .split('•')
          .map((item) => item.trim())
          .filter((item) => item.length > 0 && !item.endsWith(':'));
        
        // Check if there was a header before the bullets (e.g. "Common examples:")
        const headerMatch = trimmed.split('•')[0].trim();
        if (headerMatch && headerMatch.endsWith(':') && headerMatch.length < 80) {
          const titleText = headerMatch.replace(/:$/, '');
          const id = slugify(titleText);
          headings.push({ id, text: titleText, level: 3 });
          blocks.push({ type: 'h3', id, text: titleText });
        }
      } else {
        // Multiline markdown lists
        const lines = trimmed.split('\n');
        listItems = lines
          .map((line) => line.replace(/^([\-\*]|\d+\.)\s+/, '').trim())
          .filter((line) => line.length > 0);
      }

      if (listItems.length > 0) {
        const isNumbered = /^\d+\./.test(trimmed);
        blocks.push({
          type: isNumbered ? 'ol' : 'ul',
          items: listItems,
        });
        return;
      }
    }

    // 7. Check if line itself is a Heading (Plain Text Heading Detection)
    if (isPlainHeading(trimmed)) {
      const cleanTitle = trimmed.replace(/:$/, '').trim();
      const id = slugify(cleanTitle);
      const level = cleanTitle.length < 40 ? 2 : 3;
      headings.push({ id, text: cleanTitle, level });
      blocks.push({ type: level === 2 ? 'h2' : 'h3', id, text: cleanTitle });
      return;
    }

    // 8. Normal Paragraphs (split very long ones into max 2-3 readable sentences)
    const paragraphs = splitLongParagraph(trimmed);
    paragraphs.forEach((p) => {
      blocks.push({ type: 'paragraph', text: p });
    });
  });

  return { blocks, headings };
};

// Helper: Detect if a standalone string looks like a heading
function isPlainHeading(str: string): boolean {
  if (str.length > 100) return false;
  
  // Sentences ending with colon that sound like section headers
  if (str.endsWith(':') && str.length < 80 && !str.includes('.')) return true;

  // Heading patterns like "What is AI? And Why It's Perfect for Young Minds"
  if (
    /^(what|why|how|getting started|step \d+|introduction|conclusion|practical|benefits|future|summary)/i.test(str) &&
    str.length < 85
  ) {
    return true;
  }

  // Short Title Case phrase with no sentence-ending punctuation (except question mark)
  if (
    str.length < 60 &&
    !str.endsWith('.') &&
    !str.endsWith('!') &&
    /^[A-Z]/.test(str) &&
    (str.match(/[A-Z]/g) || []).length >= 2
  ) {
    return true;
  }

  return false;
}

// Helper: Split single long unformatted text block into logical sections
function splitUnstructuredText(text: string): string[] {
  const result: string[] = [];
  
  // Known section delimiter phrases in raw text
  const headingRegex = /(?:^|\. |\?\s+|\!\s+)(What is [^?]+\?|Why [^?:]+[:?]?|How [^?:]+[:?]?|Getting Started [^:.]+:?|Step \d+:[^:.]+:?|Common examples:|Why Should Kids Learn [^:.]+:?|Key Takeaways:?|Tip:?)/gi;

  let lastIndex = 0;
  let match;

  while ((match = headingRegex.exec(text)) !== null) {
    const matchStart = match.index + (match[0].startsWith('.') || match[0].startsWith('?') || match[0].startsWith('!') ? 2 : 0);
    
    if (matchStart > lastIndex) {
      const priorText = text.substring(lastIndex, matchStart).trim();
      if (priorText) result.push(priorText);
    }

    const headingText = match[1].trim();
    result.push(headingText);
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    const remaining = text.substring(lastIndex).trim();
    if (remaining) result.push(remaining);
  }

  // If regex found no split points, split by sentence groups
  if (result.length === 0) {
    return [text];
  }

  return result;
}

// Helper: Split very long paragraph into 2-3 sentence chunks for optimal readability
function splitLongParagraph(text: string): string[] {
  if (text.length <= 320) return [text];

  const sentences = text.match(/[^.!?]+[.!?]+(\s+|$)/g) || [text];
  if (sentences.length <= 2) return [text];

  const paragraphs: string[] = [];
  let currentGroup = '';

  sentences.forEach((sentence) => {
    currentGroup += sentence;
    if (currentGroup.length >= 240) {
      paragraphs.push(currentGroup.trim());
      currentGroup = '';
    }
  });

  if (currentGroup.trim()) {
    paragraphs.push(currentGroup.trim());
  }

  return paragraphs.length > 0 ? paragraphs : [text];
}

// Helper: Rich text renderer for inline bold (**text**), italic (*text*), code (`code`), or links
const FormattedText: React.FC<{ text: string }> = ({ text }) => {
  if (!text) return null;

  return (
    <ReactMarkdown 
      remarkPlugins={[remarkGfm]}
      components={{
        p: ({ node, ...props }) => <span {...props} />,
        a: ({ node, ...props }) => (
          <a 
            {...props} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-primary-600 font-bold underline hover:text-primary-700 transition-colors"
          />
        ),
        strong: ({ node, ...props }) => <strong className="font-extrabold text-slate-900" {...props} />,
        em: ({ node, ...props }) => <em className="italic text-slate-800" {...props} />,
        code: ({ node, ...props }) => (
          <code className="px-1.5 py-0.5 bg-slate-100 text-primary-700 font-mono text-sm rounded" {...props} />
        ),
      }}
    >
      {text}
    </ReactMarkdown>
  );
};

export const ArticleContentRenderer: React.FC<ArticleContentRendererProps> = ({
  content,
  onHeadingsExtracted,
}) => {
  const { blocks, headings } = useMemo(() => {
    const parsed = parseContentToBlocks(content);
    if (onHeadingsExtracted && parsed.headings.length > 0) {
      setTimeout(() => onHeadingsExtracted(parsed.headings), 0);
    }
    return parsed;
  }, [content]);

  if (!blocks || blocks.length === 0) {
    return <p className="text-slate-500 italic">No article content available.</p>;
  }

  return (
    <article className="blog-article-content space-y-6 sm:space-y-7 text-slate-800 font-sans">
      {blocks.map((block, idx) => {
        switch (block.type) {
          case 'h2':
            return (
              <h2
                key={idx}
                id={block.id}
                className="scroll-mt-32 text-2xl sm:text-[30px] font-black text-slate-900 leading-snug tracking-tight mt-10 sm:mt-12 mb-4 pt-4 border-t border-slate-100/80 first:border-t-0 first:pt-0"
              >
                {block.text}
              </h2>
            );

          case 'h3':
            return (
              <h3
                key={idx}
                id={block.id}
                className="scroll-mt-32 text-xl sm:text-[22px] font-bold text-slate-800 leading-snug tracking-tight mt-7 sm:mt-8 mb-3"
              >
                {block.text}
              </h3>
            );

          case 'paragraph':
            return (
              <p
                key={idx}
                className="text-[16px] sm:text-[18px] text-slate-700 font-normal leading-[1.75] sm:leading-[1.8] mb-5 sm:mb-6 tracking-normal"
              >
                <FormattedText text={block.text || ''} />
              </p>
            );

          case 'ul':
            return (
              <ul key={idx} className="my-6 space-y-3 pl-2">
                {block.items?.map((item, itemIdx) => (
                  <li key={itemIdx} className="flex items-start gap-3 text-[16px] sm:text-[17px] text-slate-700 leading-relaxed">
                    <span className="w-2 h-2 rounded-full bg-primary-500 mt-2.5 flex-shrink-0" />
                    <span>
                      <FormattedText text={item} />
                    </span>
                  </li>
                ))}
              </ul>
            );

          case 'ol':
            return (
              <ol key={idx} className="my-6 space-y-3 pl-2">
                {block.items?.map((item, itemIdx) => (
                  <li key={itemIdx} className="flex items-start gap-3 text-[16px] sm:text-[17px] text-slate-700 leading-relaxed">
                    <span className="w-6 h-6 rounded-full bg-primary-100 text-primary-700 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                      {itemIdx + 1}
                    </span>
                    <span>
                      <FormattedText text={item} />
                    </span>
                  </li>
                ))}
              </ol>
            );

          case 'callout':
            return (
              <div
                key={idx}
                className={`my-8 p-5 sm:p-7 rounded-2xl sm:rounded-3xl border-l-4 shadow-sm transition-all flex items-start gap-4 ${
                  block.calloutType === 'takeaway'
                    ? 'bg-emerald-50/80 border-emerald-500 text-emerald-950'
                    : block.calloutType === 'fact'
                    ? 'bg-indigo-50/80 border-indigo-500 text-indigo-950'
                    : 'bg-amber-50/80 border-amber-500 text-amber-950'
                }`}
              >
                <div className="p-2.5 rounded-xl bg-white/90 shadow-sm flex-shrink-0 mt-0.5">
                  {block.calloutType === 'takeaway' ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  ) : block.calloutType === 'fact' ? (
                    <Sparkles className="w-5 h-5 text-indigo-600" />
                  ) : (
                    <Lightbulb className="w-5 h-5 text-amber-600" />
                  )}
                </div>
                <div>
                  {block.title && (
                    <span className="block text-xs font-black uppercase tracking-widest opacity-70 mb-1">
                      {block.title}
                    </span>
                  )}
                  <p className="text-[15px] sm:text-[17px] font-medium leading-relaxed">
                    <FormattedText text={block.text || ''} />
                  </p>
                </div>
              </div>
            );

          case 'quote':
            return (
              <blockquote
                key={idx}
                className="my-8 p-6 sm:p-8 rounded-2xl sm:rounded-3xl bg-primary-50/60 border-l-4 border-primary-500 text-slate-800 italic text-lg sm:text-xl font-medium leading-relaxed relative"
              >
                <Quote className="absolute top-4 right-4 w-10 h-10 text-primary-200 pointer-events-none" />
                <p className="relative z-10">"{block.text}"</p>
              </blockquote>
            );

          default:
            return null;
        }
      })}
    </article>
  );
};
