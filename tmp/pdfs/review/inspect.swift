import Foundation
import PDFKit
import AppKit
let doc = PDFDocument(url: URL(fileURLWithPath: CommandLine.arguments[1]))!
let dir = CommandLine.arguments[2]
var text = ""
for i in 0..<doc.pageCount {
 let page = doc.page(at:i)!
 text += "\n===== PAGE \(i+1) =====\n" + (page.string ?? "")
 let bounds = page.bounds(for:.mediaBox)
 let img = page.thumbnail(of: NSSize(width:1000,height:1415), for:.mediaBox)
 let rep = NSBitmapImageRep(data:img.tiffRepresentation!)!
 try rep.representation(using:.png, properties:[:])!.write(to:URL(fileURLWithPath:"\(dir)/page-\(i+1).png"))
}
try text.write(toFile:"\(dir)/text.txt",atomically:true,encoding:.utf8)
print("Pages: \(doc.pageCount)")
