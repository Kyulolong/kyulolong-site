import Foundation
import AppKit
let dir = "tmp/pdfs/review"
for group in 0..<5 {
 let img = NSImage(size:NSSize(width:1500,height:1445))
 img.lockFocus()
 NSColor.lightGray.setFill(); NSRect(x:0,y:0,width:1500,height:1445).fill()
 for j in 0..<6 {
 let n = group*6+j+1
 let p = NSImage(contentsOfFile:"\(dir)/page-\(n).png")!
 p.draw(in:NSRect(x:(j%3)*500,y:1445-(j/3+1)*720,width:495,height:700))
 }
 img.unlockFocus()
 let rep=NSBitmapImageRep(data:img.tiffRepresentation!)!
 try rep.representation(using:.png,properties:[:])!.write(to:URL(fileURLWithPath:"\(dir)/contact-\(group+1).png"))
}
