   function Point(x1, y1) {
      this.x = x1;
	  this.y = y1;
   };
   
   Point.prototype.getX = function() {
      return this.x;
   };
   
   Point.prototype.getY = function() {
      return this.y;
   };
   
   /*
   Point.prototype.atEdge = function(objx, objy, ObjectWidth, ObjectHeight) {
      var edge = 0;
	  // edge = 1, right side; edge = 2, left side;
	  // edge = 3, top,      ; edge = 4, bottom;
	  // edge = 5, top right, 6 bottom right, 7 top left, 8 bottom left
	  
	  if 
   }
   */
   
   Point.prototype.inbounds = function(onStage) {
   
      var Point1      = new Point(onStage.x, onStage.y);
	  var Point2      = new Point(onStage.x + onStage.canvas.width, onStage.y);
	  var Point3      = new Point(onStage.x + onStage.canvas.width, onStage.y + onStage.canvas.height);
	  var Point4      = new Point(onStage.x, onStage.y + onStage.canvas.height);
      var answer1 = false; 
	  var answer2 = false;
	  var answer3 = false;
	  var answer4 = false;
	  var finalAnswer = false;
	  
	  if (this.x > Point1.getX() && this.y > Point1.getY()) {
         answer1 = true;
      }	  
	  
	  if (this.x < Point2.getX() && this.y > Point1.getY()) {
         answer2 = true;
      }	  
	  
	  if (this.x < Point3.getX() && this.y < Point3.getY()) {
	     answer3 = true;
	  }
	  
	  if (this.x > Point4.getX() && this.y < Point4.getY()) {
	      answer4 = true;
	  }
	  
	  if (answer1 && answer2 && answer3 && answer4) {
	      finalAnswer = true;
	  }
	  return finalAnswer;
   };
   
   Point.prototype.near = function(pxy, dstnc) {
      var answer = false;
	  if ((this.x > (pxy.getX() - dstnc) && this.x < (pxy.getX() + dstnc)) && ( this.y > (pxy.getY()-dstnc) && this.y < (pxy.getY()+dstnc)))
	  {
          answer = true;
	  }
	  return answer;
   };
   
