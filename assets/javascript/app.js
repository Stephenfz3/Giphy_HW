if (window.attachEvent) {window.attachEvent('onload', load);}
else if (window.addEventListener) {window.addEventListener('load', load, false);}
else {document.addEventListener('load', load, false);}
function load() {
   
    var generator = {
        
        topics: ["Music", "Poetry", "Rave", "Trippy", "Dj", "Deadmau5"],

        $buttonSection: $("#buttonSection"),
       
        $addTopicInput: $("#topicInput"),
      
        $addTopicButton: $("#topicButton"),
      
        $gifSection: $("#gifSection"),
      
        createTopicsButtons: function() {
            generator.clearTopicsButtons();
            for (var i = 0; i < generator.topics.length; i++) {
                generator.createButton(generator.topics[i]);
            }
        },
        /**
         * This method is used to clear the button section of all buttons.
         */
        clearTopicsButtons: function() {
            generator.$buttonSection.empty();
        },
        /**
         * This method is used to create a new button and display it to the user in the button section.
         * @param {String} topic
         * The name of the topic that will display in the button and will be the category of gif that will be created when pushed.
         */
        createButton: function(topic) {
            var $newButton = $("<button>");
            $newButton.attr("class", "topicButton");
            $newButton.text(topic);
            generator.$buttonSection.append($newButton);
        },
        /**
         * This method is used to add a new topic to the [topics] array.
         * @param {String} topic
         * The string value of the topic to be added to the [topics] array.
         */
        addTopic: function(topic) {
            generator.topics.push(topic);
        },
        /**
         * This method is used to make the ajax call to the Giphy API service. Once request is completed the response is sent off to display the gifs.
         * @param {String} topic
         * The search term or query to be searched in the Giphy API. 
         */
        requestGifs: function(topic) {
            var queryURL = "https://api.giphy.com/v1/gifs/search?q=" + topic + "&api_key=fOviTj7Gk4umzgqDN2LQyW51gu02PC28&limit=10";
            $.ajax({
                url: queryURL,
                method: "GET"
            }).done(function(res) {
                generator.clearGifDisplay();
                generator.displayGifs(res);
            });
        },
        /**
         * This method is used to display the gifs to the user. A new div is created to hold the image and rating caption. The image element is given attributes to hold the url for still and animated display.
         * @param {JSON} gifs
         * The JSON response object from the request to the Giphy API based on what button was pressed by the user.
         */
        displayGifs: function(gifs) {
            for (var i = 0; i < gifs.data.length; i++) {
                var $gifDiv = $("<div>");
                $gifDiv.attr("class", "gifWrapper");
                var $gifImg = $("<img>");
                $gifImg.attr("class", "gifImage");
                $gifImg.attr("src", gifs.data[i].images.fixed_height_still.url);
                $gifImg.attr("data-still-URL", gifs.data[i].images.fixed_height_still.url);
                $gifImg.attr("data-animated-URL", gifs.data[i].images.fixed_height.url);
                $gifImg.attr("data-status", "still");
                $gifDiv.append($gifImg);
                var $ratingCaption = $("<p>");
                $ratingCaption.attr("class", "ratingCaption");
                $ratingCaption.text("Rating: " + gifs.data[i].rating);
                $gifDiv.append($ratingCaption);
                generator.$gifSection.append($gifDiv);
            }
        },
        
        clearGifDisplay: function() {
            generator.$gifSection.empty();
        },
        /**
         * This method is called when the gif image is clicked on to toggle the state of the gif between animated and still.
         * @param {HTMLImageElement} gif
         * The image that was clicked on by the user to be toggled between animated and still.
         */
        toggleGifAnimation: function(gif) {
            if (gif.attr("data-status") === "still") {
                gif.attr("src", gif.attr("data-animated-URL"));
                gif.attr("data-status", "animated");
            }
            else if (gif.attr("data-status") === "animated") {
                gif.attr("src", gif.attr("data-still-URL"));
                gif.attr("data-status", "still");
            }
        }
    }

    generator.createTopicsButtons();

    $(document).on("click", ".topicButton", function(e) {
        generator.requestGifs(e.currentTarget.innerHTML);
    });

    generator.$addTopicButton.on("click", function(e) {
        e.preventDefault();
        generator.addTopic(generator.$addTopicInput.val());
        generator.createTopicsButtons();
    });

    $(document).on("click", ".gifImage", function() {
        generator.toggleGifAnimation($(this));
    })
}