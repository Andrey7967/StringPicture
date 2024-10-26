let iter = 3500;
let pi = 250;
let clearNum = 30;
let scale = 3;
let thickness = 0.5;
let ctx = document.getElementById("canvas").getContext("2d");

let img = document.getElementById("fox");

ctx.drawImage(img,0,0,500,500);
size = 500;
let image_data = ctx.getImageData(0, 0, size, size);
let rgb_data = image_data.data ;



let mono_rgb = []



  
ind= 0
for(let y = 0; y<size; y++) {
    let yarr = []
    for(let x = 0; x<size; x++) {
    
    let red = rgb_data[ind]
    let green = rgb_data[ind+1]
    let blue = rgb_data[ind+2]
    let avg = 255 - Math.round((red + green + blue)/3);
    yarr.push([avg,avg,avg,255])
    ind+=4
    }
    mono_rgb.push(yarr);
}

ctx.clearRect(0,0,600,600);
for(let y = 0; y<size; y++) {
    for(let x = 0; x<size; x++) {
        ctx.fillStyle= "rgb(" + String(255-mono_rgb[y][x][0]) +","+ String(255-mono_rgb[y][x][0]) +","+ String(255-mono_rgb[y][x][0]) +")";
        ctx.fillRect(x,y,1,1);
        
        
    
    }
} 

let pins = []
let bias =  (2 * Math.PI)/pi
let marg = size/2;
for(let x = 0 ; x<pi; x++) {
    pin = {
        x: 0,
        y: 0
    }
    t_cord = bias * x
    sin  = Math.sin(t_cord)
    cos =  Math.cos(t_cord)
  


    pin.x =marg + Math.floor(cos * marg)
    if(pin.x==size) {
        pin.x=size-1 
    }
    pin.y =  marg - Math.floor(sin * marg)
    if(pin.y==size) {
        pin.y=size-1;
    }

    pins.push(pin)
}
 
let gen =document.getElementById("generated");
let a = gen.getContext("2d");


discovered_pins = [];

function check_el(el,arr) {
    let flag = 0;
    for(i=0;i<arr.length;i++) {
        if(el == arr[i]) {
            flag = 1;
            break
        }
    }

    if(flag == 1) {
        return 1
    } else {
        return 0
    }

}

let previous = 0;
ctx.clearRect(0,0,500,500);
function ma_line(ind) {
    let x = pins[ind].x;
    let y = pins[ind].y ;
  
    let maxx =0 ;
    let address = 0;
    let summ = 0;
    let weight = 0;
    for(let p= 0;p<pi; p++) {
        if(p!= ind && p!= ind+1 && p!= ind-1  && p!=previous ) {
            let x1 =  pins[p].x;
            let y1 =  pins[p].y;
            let diff_x= x1-x;
            let diff_y = y1-y;
            summ = 0;
            weight = 0;
            if(diff_x==0) {
 
                let start = Math.min(y1,y);
            
                for(let xi = start; xi<Math.max(y1,y)+1;xi++) {
                    summ += mono_rgb[xi][x][0];
                }
                weight = summ/(Math.abs(diff_y)+1)
                if(weight>maxx) {
                    maxx = weight;
                    address = p;
                  
                    
                }
            
            } else if(diff_y == 0) {
               
     
                    let start = Math.min(x1,x);
                
                    for(let xi = start; xi<Math.max(x1,x)+1;xi++) {
                        summ += mono_rgb[y][xi][0];
                    }
                    weight = summ/(Math.abs(diff_x)+1);
                    if(weight>maxx) {
                        maxx = weight;
                        address = p;
                       
                        
                    }
                  
            } else {
                let start = 0;
                let end = 0;
                if(Math.abs(diff_x) > Math.abs(diff_y)) {
                    start = Math.min(x,x1);
                    end = Math.max(x,x1)+1;
                    let depended = 0;
                    for(let xi = start; xi<end;xi++) {
                        depended = Math.round((xi- x)*(y1-y)/(x1-x)+y);
                        summ += mono_rgb[depended][xi][0];
                    }
                    weight = summ/(Math.abs(diff_x)+1);
                    if(weight>maxx) {
                        maxx = weight;
                        address = p;
                    
                    } 
                
                } else {
                    start = Math.min(y,y1);
                    end = Math.max(y,y1)+1;
                    let depended = 0;
                    for(let xi = start; xi<end;xi++) {
                        depended =Math.round((xi- y)*(x1-x)/(y1-y)+x);
                       
                        summ += mono_rgb[xi][depended][0];
                    }
                    weight = summ/(Math.abs(diff_y)+1);
                    if(weight>maxx) {
                        maxx = weight;
                        address = p;
                        
                        
                    } 
                    
                }
               

            }
             
           
       
    } 
}
// clear filled path from image
  
        let x1 =  pins[address].x;
        let y1 =  pins[address].y;
        let diff_x= x1-x;
        let diff_y = y1-y;
        ctx.fillStyle="red";
      
        if(diff_x==0) {

            let start = Math.min(y1,y);
        
            for(let xi = start; xi<Math.max(y1,y)+1;xi++) {
                mono_rgb[xi][x][0] -= clearNum;
                ctx.fillRect(x,xi,1,1);
            }
           
        } else if(diff_y == 0) {
           
 
                let start = Math.min(x1,x);
            
                for(let xi = start; xi<Math.max(x1,x)+1;xi++) {
                    mono_rgb[y][xi][0] -= clearNum;
                    ctx.fillRect(xi,y,1,1);
                }
               
        } else {
            let start = 0;
            let end = 0;
            
            if(Math.abs(diff_x) > Math.abs(diff_y)) {
                start = Math.min(x,x1);
                end = Math.max(x,x1)+1;
                let depended = 0;
                for(let xi = start; xi<end;xi++) {
                    depended = Math.round((xi- x)*(y1-y)/(x1-x)+y);
  
                    mono_rgb[depended][xi][0] -= clearNum;
                    ctx.fillRect(xi,depended,1,1);
                }
              

            } else {
                start = Math.min(y,y1);
                end = Math.max(y,y1)+1;
                let depended = 0;
                for(let xi = start; xi<end;xi++) {
                    depended = Math.round((xi- y)*(x1-x)/(y1-y)+x);

                    mono_rgb[xi][depended][0]-= clearNum;
                    ctx.fillRect(depended,xi,1,1);
                }
               
            }
        }    
    
    
   /* let xd =  pins[address].x
    let yd =  pins[address].y
    let diff_x= xd-x
    let diff_y = yd-y
    let feedback_var = 0.3
            
    let start_x1 =  Math.min(xd,x)
    
            if(diff_x == 0) {
                
                let start = Math.min(yd,y)
            
                for(let xi = start; xi<Math.max(yd,y)+1;xi++) {
                    mono_rgb[xi][start_x1][0]=mono_rgb[xi][start_x1][0]-50
                    if(xi+1<500) {
                        mono_rgb[xi+1][start_x1][0]=mono_rgb[xi+1][start_x1][0]-20
                    }
                    if(xi-1>0) {
                        mono_rgb[xi-1][start_x1][0]=mono_rgb[xi-1][start_x1][0]-20
                    }
                
            }
               
            } else {
                let linear_k = diff_y/diff_x
                
                
                let linear_bias = yd - (linear_k * xd)
            for(let xi= start_x1; xi<Math.max(xd,x)+1;xi++) {
                lin_x = xi
                lin_y = Math.round(( xi * linear_k)+ linear_bias)-1
                
                mono_rgb[lin_y][lin_x][0]=mono_rgb[lin_y][lin_x][0]-50
                if(lin_y+1<500) {
                    mono_rgb[lin_y+1][lin_x][0]=mono_rgb[lin_y+1][lin_x][0]-20
                }
                if(lin_y-1>0) {
                    mono_rgb[lin_y-1][lin_x][0]=mono_rgb[lin_y-1][lin_x][0]-20
                }
              
        } 
    }*/

   discovered_pins.push(address);
    previous = address
    return address
    
}
 

/*function max_line(ind) {
    let pin_summs = {
        ind: ind,
        summs: []
    }
    let x = pins[ind].x
    let y = pins[ind].y
    for(let p= 0;p<pi; p++) {
        if(p!= ind) {
            let x1 =  pins[p].x
            let y1 =  pins[p].y
            let diff_x= x1-x
            let diff_y = y1-y
            
            
            let start_x =  Math.min(x1,x)
            let summ = 0
            if(diff_x == 0) {
                
                let start = Math.min(y1,y)
            
                for(let xi = start; xi<Math.max(y1,y);xi++) {
                    summ += mono_rgb[xi][start_x][0]
                  
            }
                let weight = summ/(Math.abs(diff_y))
                pin_summs.summs.push([p,weight]);
            } else {
                let linear_k = diff_y/diff_x
                
                
                let linear_bias = y1 - (linear_k * x1)
            for(let xi= start_x; xi<Math.max(x1,x)+1;xi++) {
                lin_x = xi
                lin_y = Math.round(( xi * linear_k)+ linear_bias)
                
                summ += mono_rgb[lin_y][lin_x][0]
               
            
        }
            let weight = summ/(Math.abs(diff_x));
            pin_summs.summs.push([p,weight]);
           
       }

        }
        
       
    }

    pin_summs.summs.sort(function(a, b) {
        return b[1] - a[1];
      });
    return pin_summs

}*/





a.fillStyle = "black"
a.lineWidth= thickness;

let selected_pin = 3;
let it= 0 
while( it<iter) {
      
   let finish_pin = ma_line(selected_pin)
  
    a.beginPath();
    
     
    
    a.moveTo(pins[selected_pin].x*scale, pins[selected_pin].y*scale);

	a.lineTo(pins[finish_pin].x*scale, pins[finish_pin].y*scale);
	a.stroke(); 
    
    selected_pin = finish_pin

    it++;
   
}

gen.style.transform = "scale("+ 1/scale +")";
gen.style.transformOrigin = "0 0";
