import React from "react";


export default function MainHeader({ text }: { text: any }) {
    return <h1 className="py-2 text-darkest text-xl lg:text-2xl">{text}</h1>;
}
