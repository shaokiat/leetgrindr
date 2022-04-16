import React from "react";
import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/ext-language_tools";

interface CodeEditorProps {
  code: string;
  onChange?: () => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ code }) => {
  return (
    <AceEditor
      mode="python"
      theme="monokai"
      // onChange={onChange}
      name="Code Editor"
      fontSize={16}
      wrapEnabled={true}
      value={code}
      // height="800px"
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
