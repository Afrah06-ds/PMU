'use client';

import React, { Fragment, ReactNode } from 'react';
import katex from 'katex';

interface LatexContentProps {
  content?: string;
  className?: string;
  displayBlock?: boolean;
}

function renderMath(expression: string, displayMode: boolean, key: string): ReactNode {
  const source = expression
    .replace(/^\$\$|\$\$$/g, '')
    .replace(/^\\\[|\\\]$/g, '')
    .replace(/^\\\(|\\\)$/g, '')
    .replace(/^\$|\$$/g, '')
    .trim();

  return (
    <span
      key={key}
      className={displayMode ? 'my-2 block overflow-x-auto text-center' : 'inline'}
      dangerouslySetInnerHTML={{
        __html: katex.renderToString(source, {
          displayMode,
          throwOnError: false,
          strict: 'ignore',
          trust: false,
        }),
      }}
    />
  );
}

function renderInline(content: string, keyPrefix: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const tokenPattern = /(\$\$[\s\S]*?\$\$|\\\[[\s\S]*?\\\]|\\\([\s\S]*?\\\)|\$[^$\n]+\$)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let tokenIndex = 0;

  while ((match = tokenPattern.exec(content)) !== null) {
    const plainText = content.slice(lastIndex, match.index);
    if (plainText) nodes.push(...renderTextCommands(plainText, `${keyPrefix}-text-${tokenIndex}`));

    const token = match[0];
    const isDisplay = token.startsWith('$$') || token.startsWith('\\[');
    nodes.push(renderMath(token, isDisplay, `${keyPrefix}-math-${tokenIndex}`));
    lastIndex = match.index + token.length;
    tokenIndex += 1;
  }

  const remaining = content.slice(lastIndex);
  if (remaining) nodes.push(...renderTextCommands(remaining, `${keyPrefix}-tail`));
  return nodes;
}

function renderTextCommands(content: string, keyPrefix: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const boldPattern = /\\textbf\{([^{}]*)\}/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let commandIndex = 0;

  while ((match = boldPattern.exec(content)) !== null) {
    const before = content.slice(lastIndex, match.index);
    if (before) nodes.push(...renderPlainText(before, `${keyPrefix}-before-${commandIndex}`));
    nodes.push(<strong key={`${keyPrefix}-bold-${commandIndex}`}>{renderInline(match[1], `${keyPrefix}-bold-${commandIndex}`)}</strong>);
    lastIndex = match.index + match[0].length;
    commandIndex += 1;
  }

  const remaining = content.slice(lastIndex);
  if (remaining) nodes.push(...renderPlainText(remaining, `${keyPrefix}-remaining`));
  return nodes;
}

function renderPlainText(content: string, keyPrefix: string): ReactNode[] {
  return content.split(/(\\\\|\n)/g).map((part, index) => {
    if (part === '\\\\' || part === '\n') return <br key={`${keyPrefix}-break-${index}`} />;
    return <Fragment key={`${keyPrefix}-plain-${index}`}>{part}</Fragment>;
  });
}

function renderBlock(content: string): ReactNode[] {
  const blocks: ReactNode[] = [];
  const blockPattern = /\\begin\{(align\*?|enumerate)\}(?:\[[^\]]*\])?([\s\S]*?)\\end\{\1\}/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let blockIndex = 0;

  while ((match = blockPattern.exec(content)) !== null) {
    const before = content.slice(lastIndex, match.index);
    if (before) blocks.push(...renderInline(before, `before-${blockIndex}`));

    if (match[1].startsWith('align')) {
      match[2].split(/\\\\/g).filter((line) => line.trim()).forEach((line, lineIndex) => {
        blocks.push(renderMath(`$$${line.replace(/&/g, '').trim()}$$`, true, `align-${blockIndex}-${lineIndex}`));
      });
    } else {
      const items = match[2].split(/\\item\s*/).filter((item) => item.trim());
      blocks.push(
        <ol key={`enumerate-${blockIndex}`} className="my-2 list-inside list-[upper-alpha] space-y-1 pl-4">
          {items.map((item, itemIndex) => <li key={`item-${blockIndex}-${itemIndex}`}>{renderInline(item.trim(), `item-${blockIndex}-${itemIndex}`)}</li>)}
        </ol>,
      );
    }

    lastIndex = match.index + match[0].length;
    blockIndex += 1;
  }

  const remaining = content.slice(lastIndex);
  if (remaining) {
    remaining.split(/\\vspace\{[^}]*\}/g).forEach((part, index, parts) => {
      if (part) blocks.push(<React.Fragment key={`remaining-${index}`}>{renderInline(part, `remaining-${index}`)}</React.Fragment>);
      if (index < parts.length - 1) blocks.push(<span key={`space-${index}`} className="block h-2" />);
    });
  }

  return blocks;
}

export function LatexContent({ content = '', className = '', displayBlock = false }: LatexContentProps) {
  if (!content) return null;

  return (
    <span className={`${displayBlock ? 'block' : 'inline'} latex-content ${className}`}>
      {renderBlock(content)}
    </span>
  );
}