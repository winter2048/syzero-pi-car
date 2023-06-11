import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  vscDarkPlus,
  materialLight,
} from "react-syntax-highlighter/dist/esm/styles/prism";

// darcula webstorm
// vscDarkPlus vscode暗色主题

type tProps = {
  textContent: string;
  darkMode?: boolean; // markdown文本
  switchRight: boolean;
};

const them = {
  dark: vscDarkPlus,
  light: materialLight,
};

const OmsViewMarkdown = (props: tProps) => {
  const { textContent, darkMode, switchRight } = props;
  const [isSourceCode, setIsSourceCode] = useState<boolean>(false);

  return (
    <div style={{ position: "relative" }}>
      <div
        className="sy-show-switch"
        title={isSourceCode ? "MarkDown" : "Text"}
        onClick={() => {
          setIsSourceCode(!isSourceCode);
        }}
        style={{
          top: "-13px",
          right: switchRight ? "-8px" : "auto",
          left: !switchRight ? "-9px" : "auto",
        }}
      >
        {isSourceCode ? "M" : "T"}
      </div>
      <div>
        {isSourceCode ? (
          <pre style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}>
            {textContent}
          </pre>
        ) : (
          <ReactMarkdown
            components={{
              code({ node, inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || "");
                return (
                  <SyntaxHighlighter
                    showLineNumbers={true}
                    style={darkMode ? (them.dark as any) : (them.light as any)}
                    language={!inline && match ? match[1] : ""}
                    PreTag="div"
                    {...props}
                  >
                    {String(children).replace(/\n$/, "")}
                  </SyntaxHighlighter>
                );
              },
            }}
          >
            {textContent}
          </ReactMarkdown>
        )}
      </div>
    </div>
  );
};

export default OmsViewMarkdown;
