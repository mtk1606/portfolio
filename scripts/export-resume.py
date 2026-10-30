from html.parser import HTMLParser
from pathlib import Path
from xml.sax.saxutils import escape
from reportlab.platypus import SimpleDocTemplate,Paragraph,KeepTogether,PageBreak
from reportlab.lib.styles import getSampleStyleSheet,ParagraphStyle
from reportlab.lib.colors import HexColor
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
pdfmetrics.registerFont(TTFont("MKRegular","/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"))
pdfmetrics.registerFont(TTFont("MKBold","/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"))
class Blocks(HTMLParser):
 def __init__(self):super().__init__();self.capture=None;self.depth=0;self.skip=0;self.buf=[];self.out=[]
 def handle_starttag(self,tag,attrs):
  if tag in ['nav','style','footer']:self.skip+=1
  if self.skip:return
  if tag in ['h1','h2','h3','p','li'] and self.capture is None:self.capture=tag;self.buf=[]
  if tag=='br' and self.capture:self.buf.append(' | ')
 def handle_endtag(self,tag):
  if tag in ['nav','style','footer']:self.skip=max(0,self.skip-1);return
  if tag==self.capture:self.out.append((tag,''.join(self.buf).strip()));self.capture=None
 def handle_data(self,text):
  if not self.skip and self.capture:self.buf.append(text)
b=Blocks();b.feed(Path('public/resume.html').read_text());styles=getSampleStyleSheet()
for name,font,size,leading,color,before,after in [('MKName','MKBold',23,27,'#263128',0,10),('MKSection','MKBold',10,14,'#6c6047',14,8),('MKBody','MKRegular',9.2,13,'#252822',0,6),('MKRole','MKBold',11,14,'#263128',4,4)]:styles.add(ParagraphStyle(name=name,fontName=font,fontSize=size,leading=leading,textColor=HexColor(color),spaceBefore=before,spaceAfter=after))
def clean(t):
 for a,z in [('↗',''),('↓',''),('—','-'),('–','-'),('’',"'"),('·',' | ')]:t=t.replace(a,z)
 return escape(t)
story=[]
for tag,text in b.out:
 if tag=='h2' and text=='SELECTED SYSTEMS & RESEARCH':story.append(PageBreak())
 style={'h1':'MKName','h2':'MKSection','h3':'MKRole'}.get(tag,'MKBody');story.append(Paragraph(('- ' if tag=='li' else '')+clean(text),styles[style]))
 if tag=='h1':story.append(Paragraph('Toronto | elkhoudimimohamed@gmail.com | github.com/mtk1606 | linkedin.com/in/mtk1606',styles['MKBody']))
def footer(c,d):
 c.setStrokeColor(HexColor('#a69a7b'));c.line(42,38,570,38);c.setFont('MKRegular',8);c.setFillColor(HexColor('#665f50'));c.drawString(42,25,'MOHAMED EL KHOUDIMI / PROFESSIONAL RECORD');c.drawRightString(570,25,str(d.page))
SimpleDocTemplate('public/assets/mohamed-el-khoudimi-resume.pdf',pagesize=(612,792),rightMargin=42,leftMargin=42,topMargin=38,bottomMargin=53,title='Mohamed El Khoudimi - Resume',author='Mohamed El Khoudimi').build(story,onFirstPage=footer,onLaterPages=footer)
