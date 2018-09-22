"use strict";
//fetch e-h api
function getGalleryData(data) { // eslint-disable-line no-unused-vars 
    if (data.length > 0) {
        return fetch("https://api.e-hentai.org/api.php", {
            method: "POST",
            body: JSON.stringify({
                "method": "gdata",
                "gidlist": data,
                "namespace": 1
            })
        }).then((res) => res.json()).then((gdata) => {
            const tags = [];
            const uploaders = [];
            const postedTime = [];
            const filecount = [];
            const filesize = [];
            gdata.gmetadata.forEach((e) => {
                postedTime.push(e.posted);
                tags.push(e.tags);
                uploaders.push(e.uploader);
                filecount.push(e.filecount);
                filesize.push(e.filesize);
            });
            return {
                tags,
                uploaders,
                postedTime,
                filecount,
                filesize
            };
        }).catch((err) => {
            console.log(err); // eslint-disable-line no-console
        });
    }
}
// get request data from page
function getRequestDataFromPage(as) { // eslint-disable-line no-unused-vars 
    const data = [];
    as.forEach((e) => {
        const gid = e.href.split("/")[4];
        const token = e.href.split("/")[5];
        data.push([gid, token]);
    });
    return data;
}