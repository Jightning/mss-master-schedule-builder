import { useEffect, useRef } from 'react';

// Strips dangerous elements and attributes to prevent XSS.
// Uses DOMParser to avoid executing event handlers during parsing.
const sanitizeHTML = (html: string): string => {
    const doc = new DOMParser().parseFromString(html, 'text/html');

    // Remove inherently dangerous element types from the entire document
    // (some tags, e.g. <style>, can be moved to <head> by the HTML parser)
    const dangerousTags = ['script', 'style', 'iframe', 'object', 'embed', 'form', 'base', 'meta', 'link'];
    dangerousTags.forEach((tag) => {
        doc.querySelectorAll(tag).forEach((el) => el.remove());
    });

    // Attributes that may contain URLs and must be validated
    const urlAttributes = new Set([
        'href', 'src', 'action', 'formaction', 'data', 'xlink:href',
        'poster', 'background', 'longdesc', 'lowsrc', 'dynsrc',
    ]);
    // Only these protocols are safe for URL attributes
    const allowedProtocols = new Set(['http:', 'https:', 'mailto:', 'tel:']);

    doc.querySelectorAll('*').forEach((el) => {
        Array.from(el.attributes).forEach((attr) => {
            // Strip event-handler attributes
            if (attr.name.toLowerCase().startsWith('on')) {
                el.removeAttribute(attr.name);
                return;
            }
            // Validate URL attributes via a protocol whitelist
            if (urlAttributes.has(attr.name.toLowerCase())) {
                let safe = false;
                try {
                    const url = new URL(attr.value, 'https://example.com');
                    safe = allowedProtocols.has(url.protocol);
                } catch {
                    // Unparseable URL — remove it
                }
                // Extra guard: decode and check raw value for smuggled protocols.
                // \s covers standard Unicode whitespace; \u0000-\u001f / \u007f-\u009f
                // cover ASCII control characters and C1 control characters.
                if (safe) {
                    try {
                        const decoded = decodeURIComponent(
                            attr.value.replace(/[\s\u0000-\u001f\u007f-\u009f]/g, '')
                        ).toLowerCase();
                        if (
                            decoded.startsWith('javascript:') ||
                            decoded.startsWith('vbscript:') ||
                            decoded.startsWith('data:')
                        ) {
                            safe = false;
                        }
                    } catch {
                        safe = false;
                    }
                }
                if (!safe) {
                    el.removeAttribute(attr.name);
                }
            }
        });
    });

    return doc.body.innerHTML;
};

// Basically because changing textarea css is way too annoying
const ContentEditable = ({ html, onChange, placeholder, className }: any) => {
    const contentEditableRef = useRef<any>(null);
    const lastHtmlRef = useRef(html);

    useEffect(() => {
        if (contentEditableRef.current) {
            // Set the innerHTML to the provided html or the placeholder if empty
            if (!html || html === '' || html === '<br>') {
                contentEditableRef.current.innerHTML = placeholder;
                contentEditableRef.current.classList.add('placeholder');
            } else {
                contentEditableRef.current.innerHTML = sanitizeHTML(html);
                contentEditableRef.current.classList.remove('placeholder');
            }
        }
    }, [html, placeholder]);

    const emitChange = () => {
        const html = contentEditableRef.current.innerHTML;

        if (html === placeholder) {
            // If it is, set it to empty
            contentEditableRef.current.innerHTML = '';
        }

        if (onChange && html !== lastHtmlRef.current) {
            onChange({
                target: {
                    value: html
                }
            });
            lastHtmlRef.current = html;
        }
    };

    return (
        <div
            id="contenteditable"
            className={className}
            ref={contentEditableRef}
            onInput={emitChange}
            onBlur={emitChange}
            contentEditable
            dangerouslySetInnerHTML={{ __html: sanitizeHTML(html) }}
        >
        </div>
    );
};

export default ContentEditable;