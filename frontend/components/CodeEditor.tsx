import React from "react";
import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/ext-language_tools";

interface CodeEditorProps {
  code: string;
  onChange: (newCode: string) => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ code, onChange }) => {
  return (
    <AceEditor
      className="flex-grow"
      placeholder="Let's Code! Use Print() to show output."
      mode="python"
      theme="monokai"
      onChange={onChange}
      name="Code Editor"
      fontSize={17}
      value={code}
      height="100%"
      showGutter={true}
      showPrintMargin={false}
      highlightActiveLine={true}
      wrapEnabled={true}
      setOptions={{
        showLineNumbers: true,
        behavioursEnabled: true,
        enableBasicAutocompletion: true,
        enableLiveAutocompletion: true,
        enableSnippets: true,
        tabSize: 2,
      }}
    />
  );
};

export default CodeEditor;
