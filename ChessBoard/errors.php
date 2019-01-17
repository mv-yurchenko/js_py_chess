<?php
/**
 * Created by PhpStorm.
 * User: mv_yurchenko
 * Date: 17.01.19
 * Time: 20:35
 */
if (count($errors) > 0) : ?>
    <div class="error">
        <?php foreach ($errors as $error) : ?>
            <p><?php echo $error ?></p>
        <?php endforeach ?>
    </div>
<?php  endif ?>