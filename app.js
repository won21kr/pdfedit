#!/usr/bin/env node
var fs = require('fs')
var PDF = require('./pdf.js')
var PDFObject = require('./PDFObject.js')
var dictionaryParser = require('./dictionaryParser.js');
var pdf = new PDF()

/**/
pdf.load('test.pdf',function(err,res){
	if(err) console.error(err)
	console.log(res);
	
	var page = pdf.addPage()
	page.metadata.Resources = pdf.pages[0].metadata.Resources
	// Reusing resources object

	var resources = pdf.getObj(page.metadata.Resources)
	//add Helvetica fonts (These are part of the 14 builtin fonts)
	resources.metadata.Font['Hel'] = {
		Type: '/Font',
		Subtype: '/Type1',
		BaseFont: '/Helvetica'
	}
	resources.metadata.Font['HelB'] = {
		Type: '/Font',
		Subtype: '/Type1',
		BaseFont: '/Helvetica-Bold'
	}
	resources.imported = false

	//page.beginTranslate(100,150)
	page.setFont('Hel',48)
	page.print('Hello World! Normal',100,150)
	//page.endTranslate()
	
	//page.beginTranslate(100,100)
	page.setFont('HelB',48)
	page.print('Hello World! Bold',100,100)
	//page.endTranslate()

	page.save()
	page.setFont('Hel',48)
	var w = page.calcWidth('Hello World!')
	page.setStrokeColor(1,0,0)
	page.drawRect(50,50,w,20)
	page.restore()
	
	page.drawFrame(10,200,50,'Title','Text')

	// Save text object to pdf and page This text object contains all the text/shape commands from above
	var textObj = page.getTextObj()
	pdf.addObj(textObj)
	page.addObj(textObj.getRef())
	
	// Raw object creation
	var text = new PDFObject()
	text.setRaw("stream\r\nBT\r\n/Hel 48 Tf\r\n50 50 Td\r\n(Hello World!) Tj\r\n/Hel 24 Tf\r\n0 -25 Td\r\n(Yay It works!) Tj\r\nET\r\nendstream")
	pdf.addObj(text)
	page.addObj(text.getRef())

	page = pdf.addPage(pdf.pages[0].id)
	
	pdf.save('test_output.pdf',log)
})
function noop(){}

function log(){
	console.log.apply(console,arguments)
}