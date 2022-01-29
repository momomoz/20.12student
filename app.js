let fs = require("fs");
const http = require("http")
let qs = require("querystring");



let server = http.createServer(function (req, res) {
    if (req.url === "/") {
        if (req.method === "GET") {
            let content = fs.readFileSync("./html/main.html", "utf-8");
            res.end(content);
        }
    }
    else if (req.url === "/students") {
        if (req.method === "GET") {
            let content = fs.readFileSync("./html/students.html", "utf-8");
            res.write(content);
        } else if (req.method === "POST") {
            let body = "";

            req.on("data", function (data) {
                body += data;
            })

            req.on("end", function () {
                let bodyObject = qs.parse(body);
                let studentObject = {
                    fullName: bodyObject.fullName,
                    group: bodyObject.group
                }
                //   fs.appendFileSync("students.txt", JSON.stringify(studentObject))
                fs.readFile("students.txt", "utf-8", function (error, data) {
                    if (error) {
                        fs.writeFile("students.txt", "", function (error) {
                            let array = []
                            array.push(studentObject)
                            fs.writeFileSync("students.txt", JSON.stringify(array))
                        })

                    } else {
                        let array = JSON.parse(data)
                        array.push(studentObject)
                        fs.writeFileSync("students.txt", JSON.stringify(array))
                    }
                })
            })
        }
    } else if (req.url === "/getStudents") {
        if (req.method === "GET") {
            //  возвращаю список студентов из файла

            //    let abc=fs.readFileSync("students.txt", "utf-8")
            res.write(fs.readFileSync("students.txt", "utf-8"))
        }
    } else if (req.url === "/clear") {
        if (req.method === "POST") { }
        fs.unlinkSync("students.txt")
    }
    res.end();

});

server.listen(3000)