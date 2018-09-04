/**
 * @file
 * Attaches behaviors for Vimeo Upload.
 */

(function ($, Drupal) {

  Drupal.behaviors.vimeoUploadBehavior = {
    attach: function (context, settings) {

      var access_token = settings.access_token

      /**
       * Called when files are dropped on to the drop target or selected by the browse button.
       * For each file, uploads the content to Drive & displays the results when complete.
       */
      function handleFileSelect(evt) {
        evt.stopPropagation()
        evt.preventDefault()

        var files = evt.dataTransfer ? evt.dataTransfer.files : $(this).get(0).files
        var results = document.getElementById('results')

        // Clear the results div.
        while (results.hasChildNodes()) results.removeChild(results.firstChild)
        // Clear the video Url and hide it.
        var videoUrlInput = document.getElementById('videoUrl')
        videoUrlInput.value = '';
        videoUrlInput.style.display = 'none';

        // Rest the progress bar and show it.
        updateProgress(0)
        document.getElementById('progress-container').style.display = 'block'

        // Instantiate Vimeo Uploader.
        ;(new VimeoUpload({
          name: document.getElementById('videoName').value,
          description: document.getElementById('videoDescription').value,
          private: document.getElementById('make_private').checked,
          file: files[0],
          token: access_token,
          upgrade_to_1080: document.getElementById('upgrade_to_1080').checked,
          onError: function(data) {
            showMessage('<strong>Error</strong>: ' + JSON.parse(data).error, 'danger')
          },
          onProgress: function(data) {
            updateProgress(data.loaded / data.total)
          },
          onComplete: function(videoId, index) {
            var url = 'https://vimeo.com/' + videoId

            if (index > -1) {
              // The metadata contains all of the uploaded video(s) details see:
              // https://developer.vimeo.com/api/endpoints/videos#/{video_id}
              url = this.metadata[index].link //

              // Add stringify the json object for displaying in a text area.
              var pretty = JSON.stringify(this.metadata[index], null, 2)

              console.log(pretty) /* echo server data */
            }

            // Display the success message and the video url.
            // @todo make it translatable
            var successMessage = '<p><strong>Upload Successful</strong>.</p>';
            if(document.getElementById('make_private').checked) {
              successMessage += '<p>Note that this video has been set as private, so you must be logged in with the Vimeo channel account to view it.</p>';
            }
            successMessage += '<p>You can now copy the URL.</p>';
            showMessage(successMessage);
            videoUrlInput.value = url;
            videoUrlInput.style.display = 'block';
          }
        })).upload()

        /**
         * Shows a message.
         *
         * @param html
         * @param type
         */
        function showMessage(html, type) {
          /* hide progress bar */
          document.getElementById('progress-container').style.display = 'none'

          /* display alert message */
          var element = document.createElement('div')
          element.setAttribute('class', 'alert alert-' + (type || 'success'))
          element.innerHTML = html
          results.appendChild(element)
        }
      }

      /**
       * Dragover handler to set the drop effect.
       *
       * @param evt
       */
      function handleDragOver(evt) {
        evt.stopPropagation()
        evt.preventDefault()
        evt.dataTransfer.dropEffect = 'copy'
      }

      /**
       * Update the progress bar.
       *
       * @param progress
       */
      function updateProgress(progress) {
        progress = Math.floor(progress * 100)
        var element = document.getElementById('progress')
        element.setAttribute('style', 'width:' + progress + '%')
        element.innerHTML = '&nbsp;' + progress + '%'
      }

      /**
       * Wire up drag & drop listeners once page loads.
       */
      $(context).find('.vimeo-upload').once('vimeoUploadBehavior').each(function () {
        var dropZone = document.getElementById('drop_zone')
        var browse = document.getElementById('browse')
        document.getElementById('videoUrl').style.display = 'none';
        dropZone.addEventListener('dragover', handleDragOver, false)
        dropZone.addEventListener('drop', handleFileSelect, false)
        browse.addEventListener('change', handleFileSelect, false)
      });
    }
  };

})(jQuery, Drupal);
