import { tags as t } from "@lezer/highlight";
import { HighlightStyle } from "@codemirror/language";

export const catppuccinLattePalette = {
    rosewater: "#dc8a78",
    flamingo: "#dd7878",
    pink: "#ea76cb",
    mauve: "#8839ef",
    red: "#d20f39",
    maroon: "#e64553",
    peach: "#fe640b",
    yellow: "#df8e1d",
    green: "#40a02b",
    teal: "#179299",
    sky: "#04a5e5",
    sapphire: "#209fb5",
    blue: "#1e66f5",
    lavender: "#7287fd",

    text: "#4c4f69",
    subtext1: "#5c5f77",
    subtext0: "#6c6f85",
    overlay2: "#7c7f93",
    overlay1: "#8c8fa1",
    overlay0: "#9ca0b0",
    surface2: "#acb0be",
    surface1: "#bcc0cc",
    surface0: "#ccd0da",
    base: "#eff1f5",
    mantle: "#e6e9ef",
    crust: "#dce0e8",
};

const p = catppuccinLattePalette;

export const catppuccinLatteHighlightStyle = HighlightStyle.define([
    // Comments
    { tag: t.comment, color: p.overlay0, fontStyle: "italic" },
    { tag: t.lineComment, color: p.overlay0, fontStyle: "italic" },
    { tag: t.blockComment, color: p.overlay0, fontStyle: "italic" },
    { tag: t.docComment, color: p.overlay1, fontStyle: "italic" },

    // Variables & names
    { tag: t.variableName, color: p.text },
    { tag: t.propertyName, color: p.blue },
    { tag: [t.special(t.variableName), t.escape], color: p.pink },
    { tag: t.definition(t.variableName), color: p.text },
    { tag: t.definition(t.propertyName), color: p.blue },
    { tag: t.local(t.variableName), color: p.text },
    { tag: t.standard(t.variableName), color: p.red },

    // Types & classes
    { tag: t.typeName, color: p.yellow },
    { tag: t.className, color: p.yellow },
    { tag: t.namespace, color: p.yellow },
    { tag: t.macroName, color: p.blue },
    { tag: t.labelName, color: p.sapphire },

    // Functions
    { tag: t.function(t.variableName), color: p.blue },
    { tag: t.function(t.propertyName), color: p.blue },
    { tag: t.definition(t.function(t.variableName)), color: p.blue },

    // Constants & literals
    { tag: t.number, color: p.peach },
    { tag: t.integer, color: p.peach },
    { tag: t.float, color: p.peach },
    { tag: t.bool, color: p.peach },
    { tag: t.null, color: p.peach },
    { tag: t.atom, color: p.peach },
    { tag: t.self, color: p.red },
    { tag: t.string, color: p.green },
    { tag: t.special(t.string), color: p.green },
    { tag: t.regexp, color: p.teal },
    { tag: t.character, color: p.teal },

    // Keywords & control
    { tag: t.keyword, color: p.mauve },
    { tag: t.controlKeyword, color: p.mauve },
    { tag: t.moduleKeyword, color: p.mauve },
    { tag: t.operatorKeyword, color: p.mauve },
    { tag: t.definitionKeyword, color: p.mauve },
    { tag: t.modifier, color: p.mauve },

    // Operators & punctuation
    { tag: t.operator, color: p.sky },
    { tag: t.derefOperator, color: p.sky },
    { tag: t.compareOperator, color: p.sky },
    { tag: t.arithmeticOperator, color: p.sky },
    { tag: t.logicOperator, color: p.sky },
    { tag: t.bitwiseOperator, color: p.sky },
    { tag: t.punctuation, color: p.subtext0 },
    { tag: t.separator, color: p.subtext0 },
    { tag: [t.bracket, t.squareBracket, t.paren, t.brace], color: p.subtext0 },

    // Tags / markup (HTML, XML, Markdown)
    { tag: t.tagName, color: p.mauve },
    { tag: t.attributeName, color: p.yellow },
    { tag: t.attributeValue, color: p.green },
    { tag: t.angleBracket, color: p.text },
    { tag: t.heading, color: p.blue, fontWeight: "bold" },
    { tag: t.heading1, color: p.blue, fontWeight: "bold" },
    { tag: t.heading2, color: p.blue, fontWeight: "bold" },
    { tag: t.heading3, color: p.blue, fontWeight: "bold" },
    { tag: t.link, color: p.sapphire, textDecoration: "underline" },
    { tag: t.url, color: p.sapphire },
    { tag: t.emphasis, color: p.text, fontStyle: "italic" },
    { tag: t.strong, color: p.text, fontWeight: "bold" },
    { tag: t.strikethrough, color: p.overlay1, textDecoration: "line-through" },
    { tag: t.quote, color: p.subtext0, fontStyle: "italic" },
    { tag: t.list, color: p.peach },
    { tag: t.monospace, color: p.teal },

    // Meta / preprocessor / misc
    { tag: t.meta, color: p.overlay1 },
    { tag: t.processingInstruction, color: p.overlay1 },
    { tag: t.annotation, color: p.yellow },
    { tag: t.changed, color: p.yellow },
    { tag: t.inserted, color: p.green },
    { tag: t.deleted, color: p.red },
    { tag: t.invalid, color: p.red, textDecoration: "underline wavy" },

    // Constants (module-level / uppercase)
    { tag: t.constant(t.variableName), color: p.peach },
    { tag: t.standard(t.tagName), color: p.mauve },
]);
