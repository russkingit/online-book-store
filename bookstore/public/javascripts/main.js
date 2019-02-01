$(document).ready(function() {
    window.location = 'http://localhost:3000/home.html?#';
    // check if signed
    if(sessionStorage.getItem('haveSigned') == "true"){
        if(sessionStorage.getItem('isAdmin') == "true"){
            $('#AUchange').html("<a href='admin.html'><span class='glyphicon glyphicon-user'></span>"+sessionStorage.getItem('signName')+"</a>");        
        }else{
            $('#AUchange').html("<a href='user.html'><span class='glyphicon glyphicon-user'></span>"+sessionStorage.getItem('signName')+"</a>");        
        }
        $("#SignOut").removeClass("hide");
    }

    //get book data
    if(sessionStorage.getItem('search') != null){
        searchBook(1);
    }else if(sessionStorage.getItem('showClass') != null){
        var className = sessionStorage.getItem('showClass');
        sessionStorage.removeItem('showClass');
        showClass(className, 1);
    }else if(sessionStorage.getItem('showTopTen') != null){
        sessionStorage.removeItem('showTopTen');
        showTopTen(1);
    }else{
        sessionStorage.removeItem('category');
        showAllBooks(1);
    }


    if(sessionStorage.getItem('numIncart') != null){
        var numInCart = sessionStorage.getItem('numIncart');
        if(numInCart>0){
            $('#numInCart').text(numInCart);    
        }
        
    }

    //login function
    $("#btnLogin").click(function(){
        var uname = $('#L_username').val();
        var upass = $('#L_password').val();
        var Spass = SHA256(upass);            // use sha256 hash table to convert password
        $.ajax({
            method:'POST',
            url: 'api/users',
            data: {
                username: uname,
            },
            success: function(users){
                sessionStorage.clear();
                console.log(users);
                $.each(users, function(i, user){
                    sessionStorage.setItem('signName', uname);
                    if(user.password == Spass){
                        hideLogin();
                        if(user.admin){
                            sessionStorage.setItem('haveSigned', "true");
                            sessionStorage.setItem('isAdmin', "true");
                            $('#AUchange').html("<a href='admin.html'><span class='glyphicon glyphicon-user'></span>"+uname+"</a>");    
                            $("#SignOut").removeClass("hide");
                        }else{
                            sessionStorage.setItem('haveSigned', "true");
                            // sessionStorage.setItem('signName', uname);
                            sessionStorage.setItem('isAdmin', "false");
                            $('#AUchange').html("<a href='user.html'><span class='glyphicon glyphicon-user'></span>"+uname+"</a>");    
                            $("#SignOut").removeClass("hide");
                        }
                    }else{
                        alert("wrong password!")
                    }
                });

                if(sessionStorage.getItem('signName') == null){
                    alert("wrong username!")
                }                           
            },
            error: function(){
                alert("error loading users");
            }
        });
        
    });

    $("#btnSignup").click(function(event){
        event.preventDefault();
        var uname = $('#S_username').val();
        var upass = $('#S_password').val();
        var umail = $('#S_email').val();
        var uaddr = $('#S_address').val();
        var flag = 0;

        if (uname.length < 1 || upass.length < 1 || umail.length < 1 || uaddr.length < 1) {
            alert("All fields are mandatory!!!");
            //showSU();
        }
        else if ( upass.length < 6 || !upass.match(/[A-z]/) || !upass.match(/[A-Z]/) || !upass.match(/\d/)){  //
            alert("Password is week!!! Password must contains at least 6 characters with at least 1 uppercase, 1 lowercase and 1 number. ");
        }
        //$.when(
        else{
            $.ajax({
            method:'POST',
            url: 'api/users',
            data: {
                username: uname,
            },
            success: function(users){                    
                $.each(users, function(i, user){
                    //$('#utest').append("UserName: "+user.user_name + "UserPass: " + user.password);
                    //alert(user.user_name+uname);
                    if(user.user_name){
                        //alert("Yes");
                        flag = 1;
                        //alert("flag:"+flag)
                        alert("This username is already exist")
                        //return flag;
                    }
                   
                });
                if (flag == 0){
                    //alert("flag:"+flag);
                    signUp(uname, upass, umail, uaddr);
                }
                
                },
                error: function(){
                    alert("error GG");
                }
            })
        }

    });

});

/*---navbar functions---*/
/*
signUp(uname, upass, umail.uaddr)
showInfo(title)
searchBook()
showClass(classValue)
showPrice(priceValue)
showTopTen()
showAllBooks()
*/
function signUp(uname, upass, umail, uaddr){
    var Spass = SHA256(upass);
    // alert("user: " + uname + "Spass: " + Spass);
    sessionStorage.setItem('haveSigned', "true");
    sessionStorage.setItem('isAdmin', "false");
    sessionStorage.setItem('signName', uname);
    var newUser = {
        user_name: uname,
        password: Spass,
        email:  umail,
        address: uaddr,
        admin: false
    }
    $.ajax({
        method:'POST',
        url: 'api/users/signup',
        data: newUser,
        success: function(users){
            $.ajax({
                method:'POST',
                url: 'api/users',
                data: {
                    username: uname,
                },
                success: function(users){                    
                    $.each(users, function(i, user){
                        // $('#utest').append("UserName: "+user.user_name + "UserPass: " + user.password);
                    });
                    hideSU();
                    $('#AUchange').html("<a href='user.html'><span class='glyphicon glyphicon-user'></span>"+sessionStorage.getItem('signName')+"</a>");        
                    $("#SignOut").removeClass("hide");
                },
                error: function(){
                    alert("error loading users");
                }
            });
    

        },
        error: function(){
            alert("Signup fail!");
        }
    });
}

function showInfo(title, k){
    var classValue = sessionStorage.getItem('category');
    //alert(classValue);
    $('#Head').html('Book Infomation');
    $('#TopList').empty('Book Infomation');
    $('#pageBtn').empty(); 
    var data = {Title: title}
    sessionStorage.getItem('category')
    $.ajax({
        method:'POST',
        url: 'api/home/searchInfo',
        data: data,
        success: function(books){            
            $.each(books, function(i, book){
                if(i == 0){
                    $('#TopList').append('<img src="../images/'+ book.Title +'.jpg" class="pic_delete">');
                    if(classValue){
                        $('#TopList').append('<form class="form-signin"><ul> <li> <b>Title: </b>'+book.Title+'</li> <li> <b>Year: </b>'+book.Year+'</li> <li> <b>Price: </b>'+book.Price+'</li> <li> <b>Category: </b>'+book.Category+'</li> <li> <b>Inventory: </b>'+book.Inventory+'</li> </ul><button class="btn btn-primary" onclick="showClass(\''+classValue+'\',' + k + ')">Go back </button><button class="btn btn-success pull-right" onclick="addToCart(\''+book.Title +'\'); return false;">add to cart </button></form>');
                    }
                    else{
                        $('#TopList').append('<form class="form-signin"><ul> <li> <b>Title: </b>'+book.Title+'</li> <li> <b>Year: </b>'+book.Year+'</li> <li> <b>Price: </b>'+book.Price+'</li> <li> <b>Category: </b>'+book.Category+'</li> <li> <b>Inventory: </b>'+book.Inventory+'</li> </ul><button class="btn btn-primary" onclick="showAllBooks(' + k + ')">Go back </button><button class="btn btn-success pull-right" onclick="addToCart(\''+book.Title +'\'); return false;">add to cart </button></form>');
                    } 
                } 
            });
        },
        error: function(){
            alert("error loading books");
        }
    });
    sessionStorage.removeItem("category");
}


// search btn
function searchBook(k){
    var stitle = $('#search').val();
    if(sessionStorage.getItem("search") != null){
        stitle = sessionStorage.getItem("search");
    }
    sessionStorage.setItem("search", stitle);
    var ss = {Title: stitle}
    $('#Head').empty();
    $('#Head').append('<h2 id="Head"> Search Result </h2>');
    $('#TopList').empty();
    $('#pageBtn').empty(); 
    $.ajax({
        method:'POST',
        url: 'api/home/search',
        data: ss,
        success: function(books){
            var minBook = parseInt((k-1)*8);            
            var maxBook = parseInt(k*8 -1);
            $.each(books, function(i, book){
                    if(i%8 == 0){
                        var pageNum = parseInt(i/8 +1);
                        if(i >= minBook && i <= maxBook){
                            $('#pageBtn').append('<a href="#" class="btn btn-danger pull-left" type="button" onclick="searchBook('+ pageNum +'); return false;">'+ pageNum +'</a>')
                        }else{
                            $('#pageBtn').append('<a href="#" class="btn btn-light pull-left" type="button" onclick="searchBook('+ pageNum +'); return false;">'+ pageNum +'</a>')    
                        }                        
                    }
                    if(i >= minBook && i <= maxBook){
                        var pageNum = parseInt(i/8 +1);
                        $('#TopList').append('<div class="col-sm-6 col-md-3"><div class="thumbnail"><a href="#" onclick="showInfo(\''+book.Title +'\','+ pageNum +')"><img src="../images/'+ book.Title +'.jpg" class="pic"></a><div class="caption"><h5>'+book.Title+'</h5><div class="clearfix"><div class="price pull-left">$'+book.Price+'</div><a href="#" class="btn btn-success pull-right" type="button" onclick="addToCart(\''+book.Title +'\'); return false;">add to cart</a></div></div></div></div>');   
                    }                    
                    
                });
        },
        error: function(){
            alert("error loading books");
        }
    });
    sessionStorage.removeItem("search");
}

function showClass(classValue,k){
    $('#Head').empty();
    $('#subHead').empty();
    $('#Head').append('<h2 id="Head">'+classValue+'</h2>');
    $('#TopList').empty();
    $('#pageBtn').empty();
    sessionStorage.setItem("category", classValue);
    var ss = {Category: classValue};
    $.ajax({
        method:'POST',
        url: 'api/home/class',
        data: ss,
        success: function(books){
            var minBook = parseInt((k-1)*8);            
            var maxBook = parseInt(k*8 -1);
            $.each(books, function(i, book){
                if(i%8 == 0){
                    var pageNum = parseInt(i/8 +1);
                    if(i >= minBook && i <= maxBook){
                        $('#pageBtn').append('<a href="#" class="btn btn-danger pull-left" type="button" onclick="showClass(\''+classValue +'\','+ pageNum +'); return false;">'+ pageNum +'</a>')
                    }else{
                        $('#pageBtn').append('<a href="#" class="btn btn-light pull-left" type="button" onclick="sshowClass(\''+classValue +'\','+ pageNum +'); return false;">'+ pageNum +'</a>')    
                    }
                    
                }
                if(i >= minBook && i <= maxBook){
                    var pageNum = parseInt(i/8 +1);
                    $('#TopList').append('<div class="col-sm-6 col-md-3"><div class="thumbnail"><a href="#" onclick="showInfo(\''+book.Title +'\','+ pageNum +')"><img src="../images/'+ book.Title +'.jpg" class="pic"></a><div class="caption"><h5>'+book.Title+'</h5><div class="clearfix"><div class="price pull-left">$'+book.Price+'</div><a href="#" class="btn btn-success pull-right" type="button" onclick="addToCart(\''+book.Title +'\'); return false;">add to cart</a></div></div></div></div>');   
                }                                        
            });
        },
        error: function(){
            alert("error loading books");
        }
    });
}

function showPrice(priceValue, k){
    var priceMax = parseInt(priceValue)*5;
    var priceMin = priceMax -5;
    $('#subHead').empty();
    $('#pageBtn').empty();
    if(priceValue == '1'){
        $('#subHead').append('<h3 id="Head">Price below $5</h3>');    
    }else if (priceValue == '5') {
        $('#subHead').append('<h3 id="Head">Price above $20</h3>');
        priceMin = 20;
        priceMax = 1000;
    }else{
        $('#subHead').append('<h3 id="Head">Price Between $'+priceMin+' to $'+ priceMax+' </h2>');
    }
    $('#TopList').empty();
    if (sessionStorage.getItem("category") == null) {
        $.ajax({
            method:'POST',
            url: 'api/home',
            success: function(books){
                var i = 0;
                var minBook = parseInt((k-1)*8);            
                var maxBook = parseInt(k*8 -1);
                $.each(books, function(v, book){
                    if(parseInt(book.Price) >= priceMin && parseInt(book.Price) < priceMax){
                        if(i%8 == 0){
                            var pageNum = parseInt(i/8 +1);
                            if(i >= minBook && i <= maxBook){
                                $('#pageBtn').append('<a href="#" class="btn btn-danger pull-left" type="button" onclick="showPrice(\''+ priceValue +'\','+ pageNum +'); return false;">'+ pageNum +'</a>')
                            }else{
                                $('#pageBtn').append('<a href="#" class="btn btn-light pull-left" type="button" onclick="showPrice(\''+ priceValue +'\','+ pageNum +'); return false;">'+ pageNum +'</a>')    
                            }
                            
                        }
                        if(i >= minBook && i <= maxBook){
                            var pageNum = parseInt(i/8 +1);
                            $('#TopList').append('<div class="col-sm-6 col-md-3"><div class="thumbnail"><a href="#" onclick="showInfo(\''+book.Title +'\','+ pageNum +')"><img src="../images/'+ book.Title +'.jpg" class="pic"></a><div class="caption"><h5>'+book.Title+'</h5><div class="clearfix"><div class="price pull-left">$'+book.Price+'</div><a href="#" class="btn btn-success pull-right" type="button" onclick="addToCart(\''+book.Title +'\'); return false;">add to cart</a></div></div></div></div>');   
                        }
                        i++;   
                    }                    
                });
            },
            error: function(){
                alert("error loading books");
            }
        });
    }else{
        var ss = {Category: sessionStorage.getItem("category")};
        $.ajax({
        method:'POST',
        url: 'api/home/class',
        data: ss,
        success: function(books){
            var i = 0;
            var minBook = parseInt((k-1)*8);            
            var maxBook = parseInt(k*8 -1);
            $.each(books, function(v, book){
                if(parseInt(book.Price) >= priceMin && parseInt(book.Price) < priceMax){
                    if(i%8 == 0){
                        var pageNum = parseInt(i/8 +1);
                        if(i >= minBook && i <= maxBook){
                            $('#pageBtn').append('<a href="#" class="btn btn-danger pull-left" type="button" onclick="showPrice(\''+ priceValue +'\','+ pageNum +'); return false;">'+ pageNum +'</a>')
                        }else{
                            $('#pageBtn').append('<a href="#" class="btn btn-light pull-left" type="button" onclick="showPrice(\''+ priceValue +'\','+ pageNum +'); return false;">'+ pageNum +'</a>')    
                        }
                        
                    }
                    if(i >= minBook && i <= maxBook){
                        var pageNum = parseInt(i/8 +1);
                        $('#TopList').append('<div class="col-sm-6 col-md-3"><div class="thumbnail"><a href="#" onclick="showInfo(\''+book.Title +'\','+ pageNum +')"><img src="../images/'+ book.Title +'.jpg" class="pic"></a><div class="caption"><h5>'+book.Title+'</h5><div class="clearfix"><div class="price pull-left">$'+book.Price+'</div><a href="#" class="btn btn-success pull-right" type="button" onclick="addToCart(\''+book.Title +'\'); return false;">add to cart</a></div></div></div></div>');   
                    }
                    i++;   
                }                    
            });
        },
        error: function(){
            alert("error loading books");
        }
    });
    }

    
}

function showTopTen(k){
    $('#Head').empty();
    $('#subHead').empty();
    $('#Head').append('<h2 id="Head">Top 10 Best Seller</h2>');
    $('#TopList').empty();
    $('#pageBtn').empty();
    sessionStorage.removeItem("category");
    $.ajax({
            method:'POST',
            url: 'api/home',
            success: function(books){
                var minBook = parseInt((k-1)*8);            
                var maxBook = parseInt(k*8 -1);
                $.each(books, function(i, book){
                    if(i<10){
                        if(i%8 == 0){
                            var pageNum = parseInt(i/8 +1);
                            if(i >= minBook && i <= maxBook){
                                $('#pageBtn').append('<a href="#" class="btn btn-danger pull-left" type="button" onclick="showTopTen('+ pageNum +'); return false;">'+ pageNum +'</a>')
                            }else{
                                $('#pageBtn').append('<a href="#" class="btn btn-light pull-left" type="button" onclick="showTopTen('+ pageNum +'); return false;">'+ pageNum +'</a>')    
                            }   
                        }
                        if(i >= minBook && i <= maxBook){
                            var pageNum = parseInt(i/8 +1);
                            $('#TopList').append('<div class="col-sm-6 col-md-3"><div class="thumbnail"><a href="#" onclick="showInfo(\''+book.Title +'\','+ pageNum +')"><img src="../images/'+ book.Title +'.jpg" class="pic"></a><div class="caption"><h5>'+book.Title+'</h5><div class="clearfix"><div class="price pull-left">$'+book.Price+'</div><a href="#" class="btn btn-success pull-right" type="button" onclick="addToCart(\''+book.Title +'\'); return false;">add to cart</a></div></div></div></div>');   
                        }  
                    }
                                                          
                });
            },
            error: function(){
                alert("error loading books");
            }
        });
}

function showAllBooks(k){
    $('#Head').empty();
    $('#Head').append('<h2 id="Head">All books</h2>');
    $('#subHead').empty();
    $('#TopList').empty();
    $('#pageBtn').empty();
    sessionStorage.removeItem("category");
    $.ajax({
            method:'POST',
            url: 'api/home',
            success: function(books){
                var minBook = parseInt((k-1)*8);            
                var maxBook = parseInt(k*8 -1);
                $.each(books, function(i, book){
                    if(i%8 == 0){
                        var pageNum = parseInt(i/8 +1);
                        if(i >= minBook && i <= maxBook){
                            $('#pageBtn').append('<a href="#" class="btn btn-danger pull-left" type="button" onclick="showAllBooks('+ pageNum +'); return false;">'+ pageNum +'</a>')
                        }else{
                            $('#pageBtn').append('<a href="#" class="btn btn-light pull-left" type="button" onclick="showAllBooks('+ pageNum +'); return false;">'+ pageNum +'</a>')    
                        }
                        
                    }
                    if(i >= minBook && i <= maxBook){
                        var pageNum = parseInt(i/8 +1);
                        $('#TopList').append('<div class="col-sm-6 col-md-3"><div class="thumbnail"><a href="#" onclick="showInfo(\''+book.Title +'\','+ pageNum +')"><img src="../images/'+ book.Title +'.jpg" class="pic"></a><div class="caption"><h5>'+book.Title+'</h5><div class="clearfix"><div class="price pull-left">$'+book.Price+'</div><a href="#" class="btn btn-success pull-right" type="button" onclick="addToCart(\''+book.Title +'\'); return false;">add to cart</a></div></div></div></div>');   
                    }                    
                    
                });
            },
            error: function(){
                alert("error loading books");
            }
        });
}

/*---sidenav functions---*/
/*
showDrop()
*/
// show price btn
function showDrop(){
    if ($('#btn_price').hasClass("hide")) {
        $('#btn_price').removeClass("hide");
        $('#btn_price').addClass("show");
    }else{
        $('#btn_price').removeClass("show");
        $('#btn_price').addClass("hide");
    }    
}


/*---modal functions---*/
/*
showLogin()
hideLogin()
showSU()
hideSU()
clearSession()
*/
function showLogin(){
    $("#logModal").modal("show");
}
function hideLogin(){
    $("#logModal").modal("hide");
}
function showSU(){
    $("#signupModal").modal("show");
}
function hideSU(){
    $("#signupModal").modal("hide");
}
function clearSession(){
    sessionStorage.clear();
}



/*---books function---*/
/*
addToCart(bookname)
*/
// add books to cart
function addToCart(bookname){
    // alert("I add "+ bookname+ " to "+ sessionStorage.getItem('signName') +"'s cart!")
    if(sessionStorage.getItem('haveSigned') != "true"){
        alert("Please Login/Signup before add to cart!")
        showLogin();
    }else{
        var ss = {Title: bookname}
        var inCart = false;
        $.ajax({
            method:'POST',
            url: 'api/home/search',
            data: ss,
            success: function(books){
                $.each(books, function(i, book){
                    var vv = {
                        user_name: sessionStorage.getItem('signName'),
                        bookid: book._id
                    }
                    $.ajax({
                        method:'POST',
                        url: 'api/users/InCart',
                        data: vv,
                        success: function(users){
                            $.each(users, function(i, user){
                                inCart = true;
                            });
                            if(inCart){
                                // alert("Already In Cart!")
                                $.ajax({
                                    method:'POST',
                                    url: 'api/users/increaseQty',
                                    data: vv,
                                    success: function(){
                                        // alert("Increase Quantity!")
                                        var num = $("#numInCart").text();
                                        num++;
                                        $('#numInCart').text(num);
                                        sessionStorage.setItem('numIncart', num);

                                    },
                                    error: function(){
                                        alert("Fail to increase Quantity!")
                                    }
                                });    
                            }else{
                                // alert("Not in Cart")
                                $.ajax({
                                    method:'POST',
                                    url: 'api/users/addToCart',
                                    data: vv,
                                    success: function(){
                                        // alert("Add to cart!")
                                        var num = $("#numInCart").text();
                                        num++;
                                        $('#numInCart').text(num);
                                        sessionStorage.setItem('numIncart', num);
                                    },
                                    error: function(){
                                        alert("error add to cart!")
                                    }
                                });
                            }
                            
                        },
                        error: function(){
                            // alert("Not in Cart")
                        }
                    });
                    


                });
            },
            error: function(){
                alert("error loading books");
            }
        });   
        }
        
}


// sha256
/**

*

*  Secure Hash Algorithm (SHA256)

*  http://www.webtoolkit.info/

*

*  Original code by Angel Marin, Paul Johnston.

*

**/

 


function SHA256(s){
    var chrsz   = 8;
    var hexcase = 0;

    function safe_add (x, y) {
        var lsw = (x & 0xFFFF) + (y & 0xFFFF);
        var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
        return (msw << 16) | (lsw & 0xFFFF);
    }

    function S (X, n) { return ( X >>> n ) | (X << (32 - n)); }

    function R (X, n) { return ( X >>> n ); }

    function Ch(x, y, z) { return ((x & y) ^ ((~x) & z)); }

    function Maj(x, y, z) { return ((x & y) ^ (x & z) ^ (y & z)); }

    function Sigma0256(x) { return (S(x, 2) ^ S(x, 13) ^ S(x, 22)); }

    function Sigma1256(x) { return (S(x, 6) ^ S(x, 11) ^ S(x, 25)); }

    function Gamma0256(x) { return (S(x, 7) ^ S(x, 18) ^ R(x, 3)); }

    function Gamma1256(x) { return (S(x, 17) ^ S(x, 19) ^ R(x, 10)); }

    function core_sha256 (m, l) {
        var K = new Array(0x428A2F98, 0x71374491, 0xB5C0FBCF, 0xE9B5DBA5, 0x3956C25B, 0x59F111F1, 0x923F82A4, 0xAB1C5ED5, 0xD807AA98, 0x12835B01, 0x243185BE, 0x550C7DC3, 0x72BE5D74, 0x80DEB1FE, 0x9BDC06A7, 0xC19BF174, 0xE49B69C1, 0xEFBE4786, 0xFC19DC6, 0x240CA1CC, 0x2DE92C6F, 0x4A7484AA, 0x5CB0A9DC, 0x76F988DA, 0x983E5152, 0xA831C66D, 0xB00327C8, 0xBF597FC7, 0xC6E00BF3, 0xD5A79147, 0x6CA6351, 0x14292967, 0x27B70A85, 0x2E1B2138, 0x4D2C6DFC, 0x53380D13, 0x650A7354, 0x766A0ABB, 0x81C2C92E, 0x92722C85, 0xA2BFE8A1, 0xA81A664B, 0xC24B8B70, 0xC76C51A3, 0xD192E819, 0xD6990624, 0xF40E3585, 0x106AA070, 0x19A4C116, 0x1E376C08, 0x2748774C, 0x34B0BCB5, 0x391C0CB3, 0x4ED8AA4A, 0x5B9CCA4F, 0x682E6FF3, 0x748F82EE, 0x78A5636F, 0x84C87814, 0x8CC70208, 0x90BEFFFA, 0xA4506CEB, 0xBEF9A3F7, 0xC67178F2);
        var HASH = new Array(0x6A09E667, 0xBB67AE85, 0x3C6EF372, 0xA54FF53A, 0x510E527F, 0x9B05688C, 0x1F83D9AB, 0x5BE0CD19);
        var W = new Array(64);
        var a, b, c, d, e, f, g, h, i, j;
        var T1, T2;
        m[l >> 5] |= 0x80 << (24 - l % 32);
        m[((l + 64 >> 9) << 4) + 15] = l;
        for ( var i = 0; i<m.length; i+=16 ) {
            a = HASH[0];
            b = HASH[1];
            c = HASH[2];
            d = HASH[3];
            e = HASH[4];
            f = HASH[5];
            g = HASH[6];
            h = HASH[7];
            for ( var j = 0; j<64; j++) {
                if (j < 16) W[j] = m[j + i];
                else W[j] = safe_add(safe_add(safe_add(Gamma1256(W[j - 2]), W[j - 7]), Gamma0256(W[j - 15])), W[j - 16]);
                T1 = safe_add(safe_add(safe_add(safe_add(h, Sigma1256(e)), Ch(e, f, g)), K[j]), W[j]);
                T2 = safe_add(Sigma0256(a), Maj(a, b, c));
                h = g;
                g = f;
                f = e;
                e = safe_add(d, T1);
                d = c;
                c = b;
                b = a;
                a = safe_add(T1, T2);
            }
            HASH[0] = safe_add(a, HASH[0]);
            HASH[1] = safe_add(b, HASH[1]);
            HASH[2] = safe_add(c, HASH[2]);
            HASH[3] = safe_add(d, HASH[3]);
            HASH[4] = safe_add(e, HASH[4]);
            HASH[5] = safe_add(f, HASH[5]);
            HASH[6] = safe_add(g, HASH[6]);
            HASH[7] = safe_add(h, HASH[7]);
        }
        return HASH;
    }

    function str2binb (str) {
        var bin = Array();
        var mask = (1 << chrsz) - 1;
        for(var i = 0; i < str.length * chrsz; i += chrsz) {
            bin[i>>5] |= (str.charCodeAt(i / chrsz) & mask) << (24 - i%32);
        }
        return bin;
    }

    function Utf8Encode(string) {
        string = string.replace(/\r\n/g,"\n");
        var utftext = "";
        for (var n = 0; n < string.length; n++) {
            var c = string.charCodeAt(n);
            if (c < 128) {
                utftext += String.fromCharCode(c);
            }
            else if((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            }
            else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }
        }
        return utftext;
    }

    function binb2hex (binarray) {
        var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
        var str = "";
        for(var i = 0; i < binarray.length * 4; i++) {
            str += hex_tab.charAt((binarray[i>>2] >> ((3 - i%4)*8+4)) & 0xF) +
            hex_tab.charAt((binarray[i>>2] >> ((3 - i%4)*8  )) & 0xF);
        }
        return str;
    }
    s = Utf8Encode(s);
    return binb2hex(core_sha256(str2binb(s), s.length * chrsz));
}


 