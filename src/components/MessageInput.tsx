import { useState } from "react";
import type { KeyboardEvent } from "react";

interface Props {
    disabled: boolean;
    channelName: string;
    onSend: (content: string) => void;
}

export default function MessageInput({
    disabled,
    channelName,
    onSend
}: Props) {

    const [text, setText] = useState("");

    function submit() {
        const content = text.trim();

        if (!content || disabled) {
            return;
        }

        onSend(content);
        setText("");
    }

    function handleKeyDown(
        event: KeyboardEvent<HTMLInputElement>
    ) {
        if (event.key === "Enter") {
            submit();
        }
    }

    return (
        <footer className="composer">

            <input
                value={text}
                placeholder={`Message #${channelName}`}
                onChange={(event) =>
                    setText(event.target.value)
                }
                onKeyDown={handleKeyDown}
                disabled={disabled}
            />

            <button
                onClick={submit}
                disabled={disabled || !text.trim()}
            >
                Send
            </button>

        </footer>
    );
}