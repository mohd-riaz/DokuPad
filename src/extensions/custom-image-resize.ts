import ImageResize from "tiptap-extension-resize-image";

export const CustomImageResize = ImageResize.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      class: {
        default: "float-none",
        parseHTML: (element) => element.getAttribute("class"),
        renderHTML: (attributes) => {
          return attributes.class ? { class: attributes.class } : {};
        },
      },
    };
  },
}).configure({
  inline: true,
});
