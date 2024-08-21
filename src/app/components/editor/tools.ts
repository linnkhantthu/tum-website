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
    // @ts-ignore
    const { file } = this._data;
    console.log("File: ", file);
    const url: string = file.url;
    // const filename = url.split("images/")[1].replace('"', "");
    const filename = url.split("%2F")[1].split("?")[0];
    fetch("/api/articles/uploadImage/", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ filename: filename }),
    });
  }
}

export const EDITOR_TOOLS = {
  list: {
    class: List,
    inlineToolbar: true,
    shortcut: "CTRL+SHIFT+L",
  },
  header: {
    class: Header,
    inlineToolbar: true,
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
    inlineToolbar: true,
    shortcut: "CTRL+SHIFT+Q",
  },
  image: {
    class: CustomImageTool,
    inlineToolbar: true,
    config: {
      endpoints: {
        byFile: `http://${window.location.host}/api/articles/uploadImage`, // Your backend file uploader endpoint
        byUrl: `http://${window.location.host}/api/articles/uploadImage`, // Your endpoint that provides uploading by Url
      },
    },
  },
  inlineCode: {
    class: InlineCode,
    inlineToolbar: true,
    shortcut: "CMD+SHIFT+G",
  },
  marker: {
    class: Marker,
    inlineToolbar: true,
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
    inlineToolbar: true,
    config: {
      endpoint: "http://localhost:8008/fetchUrl", // Your backend endpoint for url data fetching,
    },
  },
  embed: {
    class: Embed,
    inlineToolbar: true,
  },
  delimiter: {
    class: Delimiter,
    inlineToolbar: true,
  },
  warning: {
    class: Warning,
    inlineToolbar: true,
    shortcut: "CMD+SHIFT+W",
    config: {
      titlePlaceholder: "Title",
      messagePlaceholder: "Message",
    },
  },
  raw: {
    class: RawTool,
    inlineToolbar: true,
  },
  attaches: {
    class: AttachesTool,
    config: {
      endpoint: "http://localhost:8008/uploadFile",
    },
  },
  paragraph: {
    class: Paragraph,
    inlineToolbar: true,
  },
};
