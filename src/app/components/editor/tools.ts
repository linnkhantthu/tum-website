import Header from "@editorjs/header";
import List from "@editorjs/list";
// @ts-ignore
import Table from "@editorjs/table";
// @ts-ignore
import Quote from "@editorjs/quote";
import Image from "@editorjs/image";
// @ts-ignore
import Marker from "@editorjs/marker";
import NestedList from "@editorjs/nested-list";
// @ts-ignore
import Checklist from "@editorjs/checklist";
// @ts-ignore
import LinkTool from "@editorjs/link";
// @ts-ignore
import Embed from "@editorjs/embed";
// @ts-ignore
import Delimiter from "@editorjs/delimiter";
// @ts-ignore
import Warning from "@editorjs/warning";
// @ts-ignore
import RawTool from "@editorjs/raw";
// @ts-ignore
import AttachesTool from "@editorjs/attaches";
import InlineCode from "@editorjs/inline-code";
// @ts-ignore
import Paragraph from "@editorjs/paragraph";

class CustomImageTool extends Image {
  removed() {
    const { file } = this._data;
    console.log("Data: ", file);
  }
}

export const EDITOR_TOOLS = {
  list: {
    class: List,
    shortcut: "CTRL+SHIFT+L",
  },
  header: {
    class: Header,
    inlineToolbar: ["marker", "link"],
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
    class: CustomImageTool,
    config: {
      endpoints: {
        byFile: `http://${window.location.host}/api/articles/uploadImage`, // Your backend file uploader endpoint
        byUrl: `http://${window.location.host}/api/articles/uploadImage`, // Your endpoint that provides uploading by Url
      },
    },
  },
  inlineCode: {
    class: InlineCode,
    shortcut: "CMD+SHIFT+G",
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
  paragraph: Paragraph,
};
