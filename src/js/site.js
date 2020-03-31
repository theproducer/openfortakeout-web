let page_footer = null;

document.addEventListener("DOMContentLoaded", function() {
    console.log("Document ready");

    const findloc_btn = document.querySelector("#findloc_btn");
    const zipcode_form = document.querySelector("#inputloc_form");
    const manual_btn = document.querySelector("#enable_zipcodeform");
    const backtotop_btn = document.querySelector(".back_to_top");
    const mobile_btn = document.querySelector("#mobilemenubtn");
    page_footer = document.querySelector("footer.main");

    if (findloc_btn) {
        findloc_btn.addEventListener("click", function() {
            if (!findloc_btn.classList.contains("loading")) {
                findloc_btn.classList.add("loading");
                geolocate();
            }            
        });
    }   

    if (manual_btn) {
        manual_btn.addEventListener("click", function() {
            geolocate_fail();
        });
    }

    if (zipcode_form) {
        document.querySelector("#inputloc_form").addEventListener("submit", function(e) {    
            e.preventDefault();    
            const form = document.querySelector("#inputloc_form");
            const zipcode = form.elements['zipcode'].value;
            
            document.querySelector("header.main").classList.add("listing");
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

    if (mobile_btn) {
        mobile_btn.addEventListener("click", function() {
            document.querySelector("header.main nav").classList.toggle("open");
        });
    }
});

window.onresize = function() {
    if (window.innerWidth >= 768 ) {
        document.querySelector("header.main nav").classList.remove("open");
    }
}

window.onscroll = function() {
    if (page_footer !== null && !page_footer.classList.contains("fixed")) {
        const viewportHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);        
        if (window.scrollY > (viewportHeight / 2)) {
            page_footer.classList.add("fixed");
        }
    }
    
}

function geolocate() {
    if (!navigator.geolocation) {
        geolocate_fail();
    } else {
        navigator.geolocation.getCurrentPosition(geolocate_success, geolocate_fail);
    }
}

function geolocate_success(position) {
    console.log(position);
    document.querySelector("header.main").classList.add("listing");
    document.querySelector(".page_home").style.display = "none";
    document.querySelector(".page_listing").style.display = "block";
    document.querySelector("footer.main").style.display = "block";
    window.listingComponent.getListing(position.coords);
}

function geolocate_fail() {
    document.querySelector("#inputloc_form").classList.remove("hide");
    document.querySelector("#findloc_btn").classList.add("hide");
}

