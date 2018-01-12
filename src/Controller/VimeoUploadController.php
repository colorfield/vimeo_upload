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
    return [
      '#type' => 'markup',
      '#markup' => $this->t('Implement method: upload'),
    ];
  }

}
