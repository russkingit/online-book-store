//var bookSelect;  
//var SelectBooks;

$(document).ready(function(){
	$('#AUchange').html("<a href='admin.html'><span class='glyphicon glyphicon-user'></span>"+sessionStorage.getItem('signName')+"</a>");

	$.ajax({
		method:'POST',
		url: 'api/users',
		data: {
                username: sessionStorage.getItem('signName'),
            },
		success: function(users){
			$.each(users, function(i, user){
				// $('#TopList').append('<li style="list-style-type:none; float:left; padding: 16px"><img style="width:200px; height:200px" src="../images/'+ book.Title +'.jpg"><br>'+ book.Title+'</li>');
				$('#SetAccount').append('<li> <b>Name: </b>'+user.user_name+'</li><li> <b>Eamil: </b>'+user.email+'</li><li> <b>Address: </b>'+user.address+'</li>');

				// var a = 'Hello World';
				// $("#p1").html(books.length/4);

				//$('#Left-List').append('<a href="#" class="list-group-item" id="List_all_books">List all books</a> <a href="#" class="list-group-item">Add a book</a> <a href="#" class="list-group-item">Delete a book</a> <a href="#" class="list-group-item">Update a book</a>');
			});
		},
		error: function(){
			alert("error loading users");
		}
	});

	$('#List_all_books').click(function(event){
		event.preventDefault();
		//$('#Left-List').append('<a href="#" class="list-group-item">List all books</a>');
		$('#Head').html('List All Books');
		//$('#MyContent').html('Liss All Books');

		$.ajax({
		method:'POST',
		url: 'api/home/searchAdmin',
		success: function(books){
			$('#MyContent').empty();
			$.each(books, function(i, book){
				$('#MyContent').append('<div class="col-sm-6 col-md-3"><div class="thumbnail"><img src="../images/'+ book.Title +'.jpg" class="pic" alt="test pic"><div class="caption"><h5>'+book.Title+'</h5><div class="clearfix"><div class="price pull-left">$'+book.Price+'</div><a href="#" class="btn btn-success pull-right" type="button">add to cart</a></div></div></div></div>');
			});
		},
		error: function(){
			alert("error loading books");
		}
		});
		
	});

	$('#Add_a_book').click(function(event){
		event.preventDefault();
		$('#Head').html('Add A Book');
		//$('#MyContent').empty();
		$('#MyContent').html('<form id="uploadImage" class="form-signin" enctype="multipart/form-data" action="/api/home/add" method="POST"><input type="file" name="imagename" id="imagename"></br><input type="text" id="B_title" class="form-control" placeholder="Title"> <input type="value" id="B_year" class="form-control" placeholder="Year"> <input type="text" id="B_price" class="form-control" placeholder="Price"> <input type="text" id="B_category" class="form-control" placeholder="Category"> <input type="value" id="B_inventory" class="form-control" placeholder="Inventory"><button id="btnAddBook" class="btn btn-lg btn-primary btn-block" type="submit" onclick="add()">Add </button></form>');
	});

	// search bar 
	$('#DeleteUpdate_a_book').click(function(event){
		event.preventDefault();
		$('#Head').html('Delete/Update A Book');
		//$('#MyContent').empty();
		$('#MyContent').html('<form class="navbar-form navbar-left"><div class="form-group"><input id="deleteSearch" type="text" class="form-control"  placeholder="Search key word"></div><button type="submit" class="btn btn-default" onclick="dSearch()">Submit</button></form>');
		  
		//$('#MyContent').html('<form class="form-signin"> <input type="text" id="B_title" class="form-control" placeholder="Title"> <button id="btnDeleteBook" class="btn btn-lg btn-primary btn-block" type="submit" onclick="deleteBook()">Delete</button></form>');	
	});

})

function add(){
   	$('#uploadImage').submit(function(e){
     	e.preventDefault();
     
     	var title = $('#B_title').val();
	    var year = $('#B_year').val(); 
	    //alert(title+year)
	    var price = $('#B_price').val();
		var category = $('#B_category').val();
		var inventory = $('#B_inventory').val();
	     
     	$(this).ajaxSubmit({
      	data: {
       	Title: title, 
       	Year: year,
        Price:  price,
		Category: category,
		Inventory: inventory,
		Delete: "false"
	   },
       contentType: 'application/json',
     	success: function(books){
           	alert("Book added and picture uploaded success!");
           	location.reload();
		},
		error: function(){
			alert("Add Book Fail!!! Please select a picture");
		}
   		});
    return false;
	});
}

function addBook(){
	var btitle = $('#B_title').val();
	var byear = $('#B_year').val();
	var bprice = $('#B_price').val();
	var bcategory = $('#B_category').val();
	var binventory = $('#B_inventory').val();
	
	// alert("user: " + uname + "Spass: " + Spass);
	var newBook = {
		Title: btitle,
		Year: byear,
		Price:  bprice,
		Category: bcategory,
		Inventory: binventory,
		Delete: "false"
		}

	$.ajax({
		method:'POST',
		url: 'api/home/addbook',
		data: newBook,
		success: function(books){
           	alert("addbook Success!")
		},
		error: function(){
			alert("addbook Fail!");
		}
	});
}

function dSearch(title){
	if (title){
		//alert(title);
		var ss = {Title: title}
	}
	else{
	    var stitle = $('#deleteSearch').val();
	    sessionStorage.setItem("dsearch", stitle);
	    var ss = {Title: stitle}
    }
    $('#MyContent').empty(); 
    $.ajax({
        method:'POST',
        url: 'api/home/searchAdmin',
        data: ss,
        success: function(books){
        	//var books = JSON.parse(books);
        	SelectBooks = books;
        	//alert(books[1]);
            $.each(books, function(i, book){ 
                $('#MyContent').append('<div class="col-sm-6 col-md-3"><div class="thumbnail"><img src="../images/'+ book.Title +'.jpg" class="pic" alt="test pic"><div class="caption"><h5>'+book.Title+'</h5><a href="#" class="btn btn-success" type="button" onclick="updateBook(\''+book.Title +'\')">Update</a><a href="#" class="btn btn-danger pull-right" type="button"onclick="deleteBook(\''+book.Title +'\')">Delete</a></div></div></div></div>');

                //$('#MyContent').html('<div class="col-sm-6 col-md-3"><div class="thumbnail thumbnail_delete"><img src="../images/'+ book.Title +'.jpg" class="pic"><div class="caption"><h5 id="Book_Title">'+book.Title+'</h5><div class="clearfix"><a href="#" class="btn btn-danger pull-right" type="button" onclick="deleteBook()">Delete</a></div></div></div></div>');
                //bookSelect = book;
            });
        },
        error: function(){
            alert("error loading books");
        }
    });
}

function deleteBook(title){
	//alert(title);
	var data = {Title: title}
	$('#Head').html('Delete a book');
	//$('#MyContent').html('<img src="../images/'+ bookSelect.Title +'.jpg" class="pic_delete">');
	//var btitle = $('#B_title').val();
    $('#MyContent').html('<h3 style="text-align: center">Do you want to delete this book?</h3>');
    var stitle = sessionStorage.getItem("dsearch");
    
    $.ajax({
        method:'POST',
        url: 'api/home/search',
        data: data,
        success: function(books){
            $.each(books, function(i, book){ 
                $('#MyContent').append('<img src="../images/'+ book.Title +'.jpg" class="pic_delete">');
                $('#MyContent').append('<form class="form-signin"><ul> <li> <b>Title: </b>'+book.Title+'</li> <li> <b>Year: </b>'+book.Year+'</li> <li> <b>Price: </b>'+book.Price+'</li> <li> <b>Category: </b>'+book.Category+'</li> <li> <b>Inventory: </b>'+book.Inventory+'</li> </ul><button id="btnAddBook" class="btn btn-danger" type="submit" onclick="delete_F(\''+book.Title +'\')">Yes, Delete </button><button id="btnAddBook" class="btn btn-success pull-right" type="submit" onclick="dSearch(\''+stitle +'\')">No, Go back </button></form>');
            });
        },
        error: function(){
            alert("error loading books");
        }
    });
}

function updateBook(title){
	//alert(title);

    var data = {Title: title}
    
    $('#Head').html('Update a book');
    var stitle = sessionStorage.getItem("dsearch");
    $.ajax({
        method:'POST',
        url: 'api/home/searchAdmin',
        data: data,
        success: function(books){
            $.each(books, function(i, book){ 
                $('#MyContent').html('<img src="../images/'+ book.Title +'.jpg" class="pic_delete">');
                //$('#MyContent').append('<span class="clearfix">Change a picture:</span>');
                //$('#MyContent').append('<form class="form-signin"><span>Change a picture:</span> <input type="file" name="imagename" id="imagename"><span>Title:</span> <input type="text" id="B_title" class="form-control" value="'+book.Title+'"><span>Year:</span> <input type="value" id="B_year" class="form-control" value="'+book.Year+'"> <span>Price:</span> <input type="text" id="B_price" class="form-control" value="'+book.Price+'"><span>Category:</span> <input type="text" id="B_category" class="form-control" value="'+book.Category+'"><span>Inventory:</span> <input type="value" id="B_inventory" class="form-control" value="'+book.Inventory+'"> <span>Delete?:</span> <input type="text" id="B_delete" class="form-control" value="'+book.Delete+'"> <button id="btnAddBook" class="btn btn-primary" type="submit" onclick="update(\''+book.Title +'\')">Update </button><button id="btnAddBook" class="btn btn-success pull-right" type="submit" onclick="dSearch(\''+stitle +'\')">No, Go back </button></form>');	
                $('#MyContent').append('<form id="uploadImage" class="form-signin" enctype="multipart/form-data" action="/api/home/updateBook" method="POST"><b>Change a picture: </b><input type="file" name="imagename" id="imagename" value="'+book.Title+'"></br><span>Title:</span> <input type="text" id="B_title" class="form-control" value="'+book.Title+'"><span>Year:</span> <input type="value" id="B_year" class="form-control" value="'+book.Year+'"> <span>Price:</span> <input type="text" id="B_price" class="form-control" value="'+book.Price+'"><span>Category:</span> <input type="text" id="B_category" class="form-control" value="'+book.Category+'"><span>Inventory:</span> <input type="value" id="B_inventory" class="form-control" value="'+book.Inventory+'"> <span>Delete?:</span> <input type="text" id="B_delete" class="form-control" value="'+book.Delete+'"> <button id="btnAddBook" class="btn btn-primary" type="submit" onclick="update_2(\''+book.Title +'\')">Update </button><button id="btnAddBook" class="btn btn-success pull-right" type="submit" onclick="dSearch(\''+stitle +'\')">No, Go back </button></form>');            
            });
        },
        error: function(){
            alert("error loading books");
        }
    });
}

function delete_F(title){
	//alert(title);
	var data = {
		Title: title,
		Delete: "true"
		}

	$.ajax({
		method:'POST',
		url: 'api/home/deletebook',
		data: data,
		success: function(books){
           	alert("Delete Success!")
		},
		error: function(){
			alert("Delete Fail!");
		}
	});
}

function update_2(title){
   	$('#uploadImage').submit(function(e){
		e.preventDefault();

		var N_title = $('#B_title').val();
		var year = $('#B_year').val(); 
		//alert(N_title+year);
		var price = $('#B_price').val();
		var category = $('#B_category').val();
		var inventory = $('#B_inventory').val();
		var Bdelete = $('#B_delete').val();
     
		$(this).ajaxSubmit({
			data: {
			N_title: N_title,
			Title: title, 
			Year: year,
			Price:  price,
			Category: category,
			Inventory: inventory,
			Delete: Bdelete
			},
			contentType: 'application/json',
			success: function(){
           		alert("Update Success!!!");
           		location.reload();
			},
			error: function(){
				alert("Update Fail!!!");
			}
		});
     return false;
	});
}

function update(title){
	var new_title = $('#B_title').val();
	var byear = $('#B_year').val();
	var bprice = $('#B_price').val();
	var bcategory = $('#B_category').val();
	var binventory = $('#B_inventory').val();
	var bdelete = $('#B_delete').val();
	
	// alert("user: " + uname + "Spass: " + Spass);
	var data = {
		new_title: new_title,
		Title: title,      // oringal title
		Year: byear,
		Price:  bprice,
		Category: bcategory,
		Inventory: binventory,
		Delete: bdelete
		}

	$.ajax({
		method:'POST',
		url: 'api/home/updatebook',
		data: data,
		success: function(books){
           	alert("Update Success!")
		},
		error: function(){
			alert("Update Fail!");
		}
	});

	updateBook(new_title);
}

/*---show Purchase History---*/
function showHistory(){
	var ss = {username: sessionStorage.getItem("signName")}
    var numOfBooks = 0;
    $('#MyContent').html('<table class="table table-striped"><thead><tr><th scope="col">#</th><th scope="col">Book Name</th><th scope="col">Quantity</th><th scope="col">Date</th></tr></thead><tbody id="history_item"></tbody></table>')
    $.ajax({
            method:'POST',
            url: 'api/users/',
            data: ss,
            success: function(users){
            	console.log(users);
                $.each(users, function(i, user){
                	// console.log(user.cart[0].bookid);
                	$.each(user.history, function(i, historyBook){
                		var vv={
                			id: historyBook.bookid
                		}
                		$.ajax({
                			method:'POST',
                			url: 'api/home/searchByid',
                			data: vv,
                			success:function(books){    
                				$.each(books, function(i, book){                					                                                    					
                					numOfBooks ++;
                					$('#numOfBooks').text(numOfBooks);                			
                					$('#history_item').append('<tr><th scope="row">' + numOfBooks + '</th><td>' + book.Title + '</td><td>' + historyBook.quantity + '</td><td>' + historyBook.date +'</td>');
                				});
                				
                			},
                			error: function(books){
                				alert("Cannot find book")
                			}
                		});

                	});
                });
            },
            error: function(){
                alert("error loading books");
            }
        });
}



/*---navbar function---*/
function clearSession(){
    sessionStorage.clear();
}

function searchBook(){
    var stitle = $('#search').val();
    sessionStorage.setItem("search", stitle);
    window.location = 'http://localhost:3000/home.html?#';
}

function showClass(className){
    sessionStorage.setItem("showClass", className);
    window.location = 'http://localhost:3000/home.html?#';
}

function showTopTen(){
    sessionStorage.setItem("showTopTen", "true");
    window.location = 'http://localhost:3000/home.html?#';
}