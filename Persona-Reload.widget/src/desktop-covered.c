// Prints 1 if any normal app window is on screen in the current Space, else 0.
// Used by ripple.js to run animations only while the desktop is uncovered.
// Build: clang -O2 -framework CoreGraphics -framework CoreFoundation desktop-covered.c -o desktop-covered
#include <CoreGraphics/CoreGraphics.h>
#include <stdio.h>
int main(void){
  CFArrayRef list=CGWindowListCopyWindowInfo(kCGWindowListOptionOnScreenOnly|kCGWindowListExcludeDesktopElements,kCGNullWindowID);
  int covered=0;
  for(CFIndex i=0;list&&i<CFArrayGetCount(list)&&!covered;i++){
    CFDictionaryRef w=CFArrayGetValueAtIndex(list,i);
    int layer=1;double alpha=0;CGRect r={0};
    CFNumberGetValue(CFDictionaryGetValue(w,kCGWindowLayer),kCFNumberIntType,&layer);
    CFNumberRef a=CFDictionaryGetValue(w,kCGWindowAlpha);if(a)CFNumberGetValue(a,kCFNumberDoubleType,&alpha);
    CGRectMakeWithDictionaryRepresentation(CFDictionaryGetValue(w,kCGWindowBounds),&r);
    covered=layer==0&&alpha>0&&r.size.width>80&&r.size.height>80; // layer 0 = normal app windows
  }
  if(list)CFRelease(list);
  printf("%d\n",covered);return 0;
}
