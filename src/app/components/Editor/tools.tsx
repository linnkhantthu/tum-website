import Header from "@editorjs/header";
import List from "@editorjs/list";
import Table from "@editorjs/table";
import Quote from "@editorjs/quote";
import ImageTool from "@editorjs/image";
import Marker from "@editorjs/marker";
import NestedList from "@editorjs/nested-list";
import Checklist from "@editorjs/checklist";
import LinkTool from "@editorjs/link";
import Embed from "@editorjs/embed";
import Delimiter from "@editorjs/delimiter";
import Warning from "@editorjs/warning";
import CodeTool from "@editorjs/code";
import RawTool from "@editorjs/raw";
import AttachesTool from "@editorjs/attaches";
import InlineCode from "@editorjs/inline-code";
import Paragraph from "@editorjs/paragraph";

export const EDITOR_TOOLS = {
  list: {
    class: List,
    shortcut: "CTRL+SHIFT+L",
  },
  header: {
    class: Header,
    shortcut: "CTRL+SHIFT+H",
    config: {
      defaultLevel: 1,
    },
  },
  table: {
    class: Table,
    shortcut: "CTRL+SHIFT+T",
    inlineToolbar: true,
    config: {
      rows: 2,
      cols: 3,
    },
  },
  quote: {
    class: Quote,
    shortcut: "CTRL+SHIFT+Q",
  },
  image: {
    class: ImageTool,
    config: {
      endpoints: {
        byFile: "http://localhost:8008/uploadFile", // Your backend file uploader endpoint
        byUrl: "http://localhost:8008/fetchUrl", // Your endpoint that provides uploading by Url
      },
    },
  },
  marker: {
    class: Marker,
    shortcut: "CTRL+SHIFT+M",
  },
  nestedList: {
    class: NestedList,
    inlineToolbar: true,
    config: {
      defaultStyle: "unordered",
    },
  },
  checklist: {
    class: Checklist,
    inlineToolbar: true,
  },
  linkTool: {
    class: LinkTool,
    config: {
      endpoint: "http://localhost:8008/fetchUrl", // Your backend endpoint for url data fetching,
    },
  },
  embed: Embed,
  delimiter: Delimiter,
  warning: {
    class: Warning,
    inlineToolbar: true,
    shortcut: "CMD+SHIFT+W",
    config: {
      titlePlaceholder: "Title",
      messagePlaceholder: "Message",
    },
  },
  raw: RawTool,
  attaches: {
    class: AttachesTool,
    config: {
      endpoint: "http://localhost:8008/uploadFile",
    },
  },
  inlineCode: {
    class: InlineCode,
    shortcut: "CMD+SHIFT+M",
  },
  paragraph: Paragraph,
};
