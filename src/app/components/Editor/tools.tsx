import Header from "@editorjs/header";
import List from "@editorjs/list";
import Table from "@editorjs/table";
import Quote from "@editorjs/quote";
import ImageTool from "@editorjs/image";
import Marker from "@editorjs/marker";

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
};
