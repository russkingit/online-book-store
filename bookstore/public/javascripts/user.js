$(document).ready(function(){
	$('#AUchange').html("<a href='user.html'><span class='glyphicon glyphicon-user'></span>"+sessionStorage.getItem('signName')+"</a>");

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
			});
		},
		error: function(){
			alert("error loading users");
		}
	});
})



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