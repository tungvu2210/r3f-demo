/* eslint-disable no-unused-vars */
/**
 * @author mrdoob / http://mrdoob.com/
 * @author Mugen87 / https://github.com/Mugen87
 */

import { Euler, EventDispatcher, Raycaster, Vector2, Vector3 } from 'three';

var IndoorControls = function (camera, domElement) {
  if (domElement === undefined) console.error('Please use "renderer.domElement".');

  this.camera = camera;
  this.domElement = domElement;

  // 控制器是否产生作用
  this.enabled = true;
  this.enabled_rotate = true;
  this.enabled_move = true;
  this.enabled_key = true;

  // 相机第一人称旋转的速度
  this.speedRotating = 0.001;
  // 是否启用第一人称旋转动画
  this.rotateAnimate = true;
  // 相机第一人称旋转的阻尼惯性
  this.rotateDamping = 0.1;
  // 相机第一人称旋转的衰减精度
  this.rotatePrecision = 0.1;

  // 相机水平移动的速度（m/s）
  this.speedMoving = 4;
  // 是否启动水平移动动画
  this.moveAnimate = true;
  // 相机水平移动的总时间（s）
  this.moveTime = 1.6;

  // 相机按键移动的速度（m/s）
  this.speedKeyMoving = 2;

  // 捕捉水平移动目标点的三维物体
  this.ground = [];

  var scope = this;

  var euler = new Euler(0, 0, 0, 'YXZ');

  var PI_2 = Math.PI / 2;

  var vec = new Vector3();

  var rect = scope.domElement.getBoundingClientRect();

  // 动画每一帧更新前的时间
  var prevTime = performance.now();

  // 相机是否允许被第一人称旋转
  var canRotate = false;
  // 相机是否正在进行第一人称旋转
  var isRotating = false;
  // 鼠标的实时移动距离
  var movement = new Vector2();
  // 鼠标静止时的实时移动距离
  var movement0 = new Vector2();
  // 鼠标上一帧的实时移动距离
  var prevMovement = new Vector2();
  // 鼠标上一次触发move事件的位置
  var prevScreen = new Vector2();
  // 鼠标的实时位置
  var mouse = new Vector2();
  // 鼠标与相机间的实时射线
  var raycaster = new Raycaster();
  // 鼠标与地面的实时交点信息
  var intersects = [];

  // 相机是否允许被水平移动
  var canMove = false;
  // 相机是否正在进行水平移动
  var isMoving = false;
  // 相机水平移动的目标点
  var target = new Vector3();
  // 相机水平移动的方向向量
  var targetDir = new Vector3();
  // 相机水平移动时到目标点距离的平方
  var targetDis = 0;
  // 匀变速运动时相机运动的总时间
  var targetTime = 0;
  // 匀变速运动时相机的加速度
  var targetAcc = 0;
  // 匀变速运动时相机的实时速度
  var targetSpeed = 0;
  // 相机水平移动时将要移动的下一个点
  var cameraLater = new Vector3();

  // 相机的按键移动状态
  var moveForward = false;
  var moveBackward = false;
  var moveLeft = false;
  var moveRight = false;
  var moveUp = false;
  var moveDown = false;
  // 相机按键移动的移动方向向量
  var moveDir = new Vector3();

  // 鼠标在地面时的移动事件
  var moveEvent = { type: 'move', intersect: null, isRotating: false };
  // 鼠标点击水平移动事件
  var mouseClickEvent = { type: 'mouseclick' };
  // 鼠标拖拽第一人称旋转事件
  var rotateDownEvent = { type: 'rotatedown' };
  // 鼠标释放第一人称旋转事件
  var rotateUpEvent = { type: 'rotateup' };

  function onContextMenu(event) {
    event.preventDefault();
  }

  function onMouseDown(event) {
    event.preventDefault();
    scope.domElement.focus();

    if (scope.enabled) {
      if (scope.enabled_rotate) canRotate = true;

      if (scope.enabled_move) canMove = true;
    }

    // 兼容touch事件
    if (event.changedTouches) {
      event = event.changedTouches[0];

      prevScreen.x = event.screenX;
      prevScreen.y = event.screenY;

      if (scope.ground.length > 0) {
        // 将鼠标位置归一化为设备坐标
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        // 通过相机和鼠标位置更新射线
        raycaster.setFromCamera(mouse, scope.camera);

        // 计算物体和射线的交点信息
        intersects = raycaster.intersectObjects(scope.ground, true);

        // 触发鼠标在地面时的移动事件
        if (intersects.length > 0) {
          moveEvent.intersect = intersects[0];
          scope.dispatchEvent(moveEvent);
        }
      }
    }
  }

  function onMouseMove(event) {
    if (!isRotating) {
      document.body.style.cursor = 'grab';
    } else {
      document.body.style.cursor = 'grabbing';
    }
    // 兼容touch事件
    if (event.changedTouches) {
      event = event.changedTouches[0];

      event.movementX = event.screenX - prevScreen.x;
      event.movementY = event.screenY - prevScreen.y;

      prevScreen.x = event.screenX;
      prevScreen.y = event.screenY;
    }
    // 获取鼠标每一帧的移动量
    if (canRotate === true) {
      if (Math.abs(event.movementX) >= 1 || Math.abs(event.movementY) >= 1) canMove = false;

      movement.x += event.movementX || event.mozMovementX || event.webkitMovementX || 0;
      movement.y += event.movementY || event.mozMovementY || event.webkitMovementY || 0;

      isRotating = true;
      moveEvent.isRotating = true;
    }

    // 获取鼠标相对于地面的实时交点
    if (scope.ground.length > 0) {
      // 将鼠标位置归一化为设备坐标
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      // 通过相机和鼠标位置更新射线
      raycaster.setFromCamera(mouse, scope.camera);

      // 计算物体和射线的交点信息
      intersects = raycaster.intersectObjects(scope.ground, true);

      // 触发鼠标在地面时的移动事件
      if (intersects.length > 0) {
        moveEvent.intersect = intersects[0];
        scope.dispatchEvent(moveEvent);
        if (!isRotating) {
          document.body.style.cursor = 'pointer';
        } else {
          document.body.style.cursor = 'grabbing';
        }
      }
    }
  }

  function onMouseUp(event) {
    event.preventDefault();
    canRotate = false;
    scope.dispatchEvent(mouseClickEvent);
    // 获取水平移动的目标位置和方向
    if (canMove === true && isMoving === false) {
      if (intersects.length === 0) return;

      target.copy(intersects[0].point);
      target.y = scope.camera.position.y;

      if (target.equals(scope.camera.position)) return;
      targetDir.subVectors(target, scope.camera.position).normalize();
      targetDis = target.distanceToSquared(scope.camera.position);

      if (scope.moveAnimate === true) {
        // 计算加速度
        targetAcc = (4 * Math.sqrt(targetDis)) / Math.pow(scope.moveTime, 2);
      }

      isMoving = true;
    }
  }

  function onKeyDown(event) {
    if (!scope.enabled || !scope.enabled_key) return;

    switch (event.keyCode) {
      case 87: // w
        moveForward = true;
        break;

      case 37: // left
      case 65: // a
        moveLeft = true;
        break;

      case 83: // s
        moveBackward = true;
        break;

      case 39: // right
      case 68: // d
        moveRight = true;
        break;

      case 38: // up
      case 81: // q
        moveUp = true;
        break;

      case 40: // down
      case 69: // e
        moveDown = true;
        break;
    }
  }

  function onKeyUp(event) {
    if (!scope.enabled || !scope.enabled_key) return;

    switch (event.keyCode) {
      case 87: // w
        moveForward = false;
        break;

      case 37: // left
      case 65: // a
        moveLeft = false;
        break;

      case 83: // s
        moveBackward = false;
        break;

      case 39: // right
      case 68: // d
        moveRight = false;
        break;

      case 38: // up
      case 81: // q
        moveUp = false;
        break;

      case 40: // down
      case 69: // e
        moveDown = false;
        break;
    }
  }

  //
  // public methods
  //

  this.connect = function () {
    scope.domElement.addEventListener('contextmenu', onContextMenu, false);

    scope.domElement.addEventListener('mousedown', onMouseDown, false);
    scope.domElement.addEventListener('mousemove', onMouseMove, false);
    document.addEventListener('mouseup', onMouseUp, false);

    scope.domElement.addEventListener('keydown', onKeyDown, false);
    scope.domElement.addEventListener('keyup', onKeyUp, false);

    scope.domElement.addEventListener('touchstart', onMouseDown, false);
    scope.domElement.addEventListener('touchmove', onMouseMove, false);
    scope.domElement.addEventListener('touchend', onMouseUp, false);

    // 确保dom元素接收按键
    if (scope.domElement.tabIndex === -1) scope.domElement.tabIndex = 0;
  };

  this.disconnect = function () {
    scope.domElement.removeEventListener('contextmenu', onContextMenu, false);

    scope.domElement.removeEventListener('mousedown', onMouseDown, false);
    scope.domElement.removeEventListener('mousemove', onMouseMove, false);
    document.removeEventListener('mouseup', onMouseUp, false);

    scope.domElement.removeEventListener('keydown', onKeyDown, false);
    scope.domElement.removeEventListener('keyup', onKeyUp, false);

    scope.domElement.removeEventListener('touchstart', onMouseDown, false);
    scope.domElement.removeEventListener('touchmove', onMouseMove, false);
    scope.domElement.removeEventListener('touchend', onMouseUp, false);
  };

  this.dispose = function () {
    this.disconnect();
  };

  this.moveForward = function (distance) {
    // move forward parallel to the xz-plane
    // assumes camera.up is y-up

    vec.setFromMatrixColumn(scope.camera.matrix, 0);

    vec.crossVectors(scope.camera.up, vec);

    scope.camera.position.addScaledVector(vec, distance);
  };

  this.moveRight = function (distance) {
    vec.setFromMatrixColumn(scope.camera.matrix, 0);

    scope.camera.position.addScaledVector(vec, distance);
  };

  this.moveUp = function (distance) {
    vec.set(0, 1, 0);

    scope.camera.position.addScaledVector(vec, distance);
  };

  // 在动画更新函数中调用
  this.update = function () {
    var time = performance.now();
    var interval = (time - prevTime) / 1000;

    // 如果鼠标位置更新，则进行第一人称旋转
    if (isRotating === true) {
      document.body.style.cursor = 'grabbing';
      if (movement.equals(movement0)) movement.copy(prevMovement);

      euler.setFromQuaternion(scope.camera.quaternion);

      euler.y += movement.x * scope.speedRotating;
      euler.x += movement.y * scope.speedRotating;

      // 限定绕x轴的旋转角度在-180°至180°之间
      euler.x = Math.max(-PI_2, Math.min(PI_2, euler.x));

      scope.camera.quaternion.setFromEuler(euler);

      if (scope.rotateAnimate === true) {
        // 使鼠标移动量趋近于(0, 0)
        movement.x = movement.x * (1 - scope.rotateDamping);
        movement.y = movement.y * (1 - scope.rotateDamping);
      } else {
        movement.copy(movement0);
      }

      if (Math.abs(movement.x) <= scope.rotatePrecision && Math.abs(movement.y) <= scope.rotatePrecision) {
        isRotating = false;
        moveEvent.isRotating = false;
      }

      prevMovement.copy(movement);
      movement.copy(movement0);
    }

    // 如果相机不位于目标点，则进行水平移动
    if (isMoving === true && target.equals(scope.camera.position) === false) {
      cameraLater.copy(scope.camera.position);

      // 计算相机水平移动后的位置
      if (scope.moveAnimate === true) {
        targetTime += interval;

        if (targetTime < scope.moveTime / 2) {
          targetSpeed += targetAcc * interval;
          cameraLater.addScaledVector(targetDir, targetSpeed * interval + 0.5 * targetAcc * interval * interval);
        } else {
          targetSpeed -= targetAcc * interval;
          cameraLater.addScaledVector(targetDir, targetSpeed * interval - 0.5 * targetAcc * interval * interval);
        }

        // console.log( targetSpeed + ',' + target.distanceTo( scope.camera.position ) );
      } else {
        cameraLater.addScaledVector(targetDir, scope.speedMoving * interval);
      }

      // 判断相机是否距离目标点足够近
      var targetDisLater = target.distanceToSquared(cameraLater);

      if (targetDisLater >= targetDis) {
        target.copy(scope.camera.position);
        targetDis = 0;
        targetTime = 0;
        targetSpeed = 0;

        isMoving = false;
      } else {
        scope.camera.position.copy(cameraLater);
        targetDis = targetDisLater;
      }
    }

    // 如果相机没有进行水平移动，则启用按键移动
    if (isMoving === false) {
      // 计算按键移动方向
      moveDir.z = Number(moveForward) - Number(moveBackward);
      moveDir.x = Number(moveRight) - Number(moveLeft);
      moveDir.y = Number(moveUp) - Number(moveDown);
      moveDir.normalize();

      // 进行相机的按键移动
      scope.moveForward(moveDir.z * scope.speedKeyMoving * interval);
      scope.moveRight(moveDir.x * scope.speedKeyMoving * interval);
      scope.moveUp(moveDir.y * scope.speedKeyMoving * interval);
    }

    prevTime = time;
  };

  // 窗口缩放或摄像机参数变更后需要调用
  this.reset = function (cameraNew, domElementNew) {
    scope.camera = cameraNew;
    scope.domElement = domElementNew;

    rect = scope.domElement.getBoundingClientRect();
  };

  this.connect();
};

IndoorControls.prototype = Object.create(EventDispatcher.prototype);
IndoorControls.prototype.constructor = IndoorControls;

export { IndoorControls };
