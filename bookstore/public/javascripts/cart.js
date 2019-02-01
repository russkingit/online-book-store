$(document).ready(function(){
    if(sessionStorage.getItem('isAdmin') == "true"){
            $('#AUchange').html("<a href='admin.html'><span class='glyphicon glyphicon-user'></span>"+sessionStorage.getItem('signName')+"</a>");        
        }else{
            $('#AUchange').html("<a href='user.html'><span class='glyphicon glyphicon-user'></span>"+sessionStorage.getItem('signName')+"</a>");        
        }
    $("#SignOut").removeClass("hide");
    var ss = {username: sessionStorage.getItem("signName")}
    var totalPrice = 0.0;
    var numOfBooks = 0;
    var numIncart = 0;
    sessionStorage.setItem("numIncart", numIncart);
    // show books in cart
    $.ajax({
            method:'POST',
            url: 'api/users/',
            data: ss,
            success: function(users){
                console.log(users);
                $.each(users, function(i, user){
                    // console.log(user.cart[0].bookid);
                    $.each(user.cart, function(i, cartBook){
                        var vv={
                            id: cartBook.bookid
                        }
                        $.ajax({
                            method:'POST',
                            url: 'api/home/searchByid',
                            data: vv,
                            success:function(books){
                                $.each(books, function(i, book){
                                    if(parseInt(book.Inventory) >= parseInt(cartBook.quantity)){
                                        var booksPrice = parseInt(cartBook.quantity)*parseFloat(book.Price);
                                        // booksPrice = booksPrice.toFixed(2);
                                        totalPrice += booksPrice;
                                        numOfBooks ++;
                                        numIncart += cartBook.quantity;
                                        $('#numOfBooks').text(numOfBooks);
                                        $('#totalPrice').text('$' + totalPrice.toFixed(2));
                                        $('#cart_item').append('<tr><th scope="row">' + numOfBooks + '</th><td>' + book.Title + '</td><td>' + cartBook.quantity + ' <button class="btn btn-default btn-xs" onclick="increaseQty(\''+book._id +'\', '+ cartBook.quantity +', '+ parseInt(book.Inventory) +')"><span class="glyphicon glyphicon-plus" aria-hidden="true"></span></button> <button class="btn btn-default btn-xs" onclick="decreaseQty(\''+book._id +'\', '+ cartBook.quantity +')"><span class="glyphicon glyphicon-minus" aria-hidden="true"></span></button> <button class="btn btn-default btn-xs" onclick="removeBook(\''+book._id +'\')"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></button></td><td>$' + booksPrice.toFixed(2) +'</td></tr>');
                                    }else{
                                        alert("Sorry! " + book.Title + " don't have enough inventroy, so we remove it from your cart!")
                                        removeBook(book._id);
                                    }
                                    sessionStorage.setItem("totalPrice", totalPrice.toFixed(2));
                                    sessionStorage.setItem("numIncart", numIncart);
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
});


function checkOut(){
    // alert("congrat! please move data from cart to history!")
    var price = sessionStorage.getItem("totalPrice");
    var ss = {
        username: sessionStorage.getItem("signName")
    }
    $.when($.ajax({
            method:'POST',
            url: 'api/users/',
            data: ss,
            success: function(users){
                $.each(users, function(i, user){
                    // console.log(user.cart[0].bookid);
                    $.each(user.cart, function(i, cartBook){
                        var cc ={
                            user_name: sessionStorage.getItem('signName'),
                            bookid: cartBook.bookid,
                            quantity: cartBook.quantity      
                        }
                        $.when($.ajax({
                                method:'POST',
                                url: 'api/users/checkOut',
                                data: cc,
                                success: function(){                                    
                                    sessionStorage.removeItem("totalPrice");
                                },
                                error: function(){
                                    // alert("Fail to remove item!")
                                }
                            })).done();
                        // console.log("Times pass success checkOut: ", count);
                        // count++;
                        removeBook(cartBook.bookid);
                        checkOutUpdate(cartBook.bookid, cartBook.quantity);
                    });
                    alert("Thank you for your shopping. Total Price is $" + price)
                });
            },
            error: function(){
                alert("error loading books");
            }
        })
    ).done(location.reload());
}

function checkOutUpdate(bookid, quantity){
    $.ajax({
        method:'POST',
        url: 'api/home/searchByid',
        data: {
            id: bookid
        },
        success:function(books){
            $.each(books, function(i, book){
                quantity = parseInt(book.Inventory) - quantity;
                $.ajax({
                    method:'POST',
                    url: 'api/home/checkOutUpdate',
                    data: {
                        bookid: bookid,
                        quantity: quantity
                    },
                    success: function(){
                        // alert("success update inventory!")
                    },
                    error: function(){
                        // alert("fail to update inventory!")
                    }
                });
            });
            
        },
        error: function(books){
            // alert("Cannot find book")
        }
    });
    
}


function removeBook(bookid){
    // alert("remove"+ vv+ " book from cart")
    var vv = {
            user_name: sessionStorage.getItem('signName'),
            bookid: bookid
        }
    $.when($.ajax({
            method:'POST',
            url: 'api/users/removeBook',
            data: vv,
            success: function(){
                // alert("Increase Quantity!")
                // console.log("Times pass here: ", count2);
                // count2++;
            },
            error: function(){
                // alert("Fail to remove item!")
            }
        })).done(location.reload());
}

function increaseQty(bookid, num, inventory){
    // alert("increase "+vv+" qty by 1!")
    // alert("here"+num)
    // check book inventory first
    // alert("book number now: " + num + "Inventory in factory: " + inventory)
    if(num+1 <= inventory){
        var vv = {
            user_name: sessionStorage.getItem('signName'),
            bookid: bookid
        }
        $.when($.ajax({
                method:'POST',
                url: 'api/users/increaseQty',
                data: vv,
                success: function(){
                    // alert("Increase Quantity!")
                },
                error: function(){
                    // alert("Fail to increase Quantity!")
                }
            })).done(location.reload());
    }else{
        alert("Sorry, we currently don't have enough inventory.")
    }
    
}

function decreaseQty(bookid, num){
    // alert("decrease "+vv+" qty by -1!")
    if(num-1 == 0){
        removeBook(bookid);
    }else{
        var vv = {
            user_name: sessionStorage.getItem('signName'),
            bookid: bookid
        }
        $.when($.ajax({
                method:'POST',
                url: 'api/users/decreaseQty',
                data: vv,
                success: function(user){
                    // alert("Increase Quantity!")
                },
                error: function(){
                    // alert("Fail to decrease Quantity!")
                }
            })).done(location.reload());
    }
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