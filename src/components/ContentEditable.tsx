import React, { useEffect, useRef } from 'react';

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
                contentEditableRef.current.innerHTML = html;
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
            dangerouslySetInnerHTML={{ __html: html }}
        >
        </div>
    );
};

export default ContentEditable;