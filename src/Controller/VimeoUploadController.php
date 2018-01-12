<?php

namespace Drupal\vimeo_upload\Controller;

use Drupal\Core\Controller\ControllerBase;

/**
 * Class VimeoUploadController.
 */
class VimeoUploadController extends ControllerBase {

  /**
   * Upload.
   *
   * @return string
   *   Return Hello string.
   */
  public function upload() {
    $build['vimeo_upload'] = [
      '#theme' => 'vimeo_upload',
      '#attached' => [
        'library' => [
          'vimeo_upload/init',
        ],
        'drupalSettings' => [
          'access_token' => '...',
        ],
      ],
    ];
    return $build;
  }

}
