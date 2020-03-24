
document.addEventListener("DOMContentLoaded", function() {
    console.log("Document ready");

    const findloc_btn = document.querySelector("#findloc_btn");
    const zipcode_form = document.querySelector("#inputloc_form");
    const backtotop_btn = document.querySelector(".back_to_top");

    if (findloc_btn) {
        findloc_btn.addEventListener("click", function() {
            geolocate();
        });
    }   

    if (zipcode_form) {
        document.querySelector("#inputloc_form").addEventListener("submit", function(e) {    
            e.preventDefault();    
            const form = document.querySelector("#inputloc_form");
            const zipcode = form.elements['zipcode'].value;
            
            document.querySelector(".page_home").style.display = "none";
            document.querySelector(".page_listing").style.display = "block";
            document.querySelector("footer.main").style.display = "block";
            window.listingComponent.getListing(null, zipcode);
        });
    }
    
    if (backtotop_btn) {
        document.querySelector(".back_to_top").addEventListener("click", function() {
            document.documentElement.scrollTop = 0;
        });
    }
});

function geolocate() {
    if (!navigator.geolocation) {
        geolocate_fail();
    } else {
        navigator.geolocation.getCurrentPosition(geolocate_success, geolocate_fail);
    }
}

function geolocate_success(position) {
    console.log(position);
    document.querySelector(".page_home").style.display = "none";
    document.querySelector(".page_listing").style.display = "block";
    document.querySelector("footer.main").style.display = "block";
    window.listingComponent.getListing(position.coords);
}

function geolocate_fail() {
    console.warn("failed to geolocate");
    document.querySelector("#inputloc_form").classList.remove("hide");
    document.querySelector("#findloc_btn").classList.add("hide");
}

