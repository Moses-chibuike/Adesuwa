"use client";
import ReactTimeAgo from "react-time-ago";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
TimeAgo.addDefaultLocale(en);
TimeAgo.addLocale(en);

export default function Timeago(createdAt) {
    return <ReactTimeAgo date={createdAt.date} locale="en-US" />;
}
