<template>
  <div class="box">
    <div class="container-2">
      <span class="icon">
        <i class="icofont-search icofont-lg"></i>
      </span>
      <input type="text" id="search" placeholder="Search..." />
    </div>
  </div>
</template>

<style lang="scss" scoped>
/** Search input expandable  */
.box {
	margin: 1.5rem 2rem;
	max-width: 300px;
	height: 35px;
	position: fixed;
	z-index: 4;
	overflow: hidden;
	box-sizing: border-box;
	right: 0;
	bottom: 0;
	color: #ddd;
}

.container-2 {
	width: 300px;
	vertical-align: middle;
	white-space: nowrap;
	position: relative;
}

.container-2 input#search {
	position: absolute;
	right: 0;
	width: 0;
	height: 35px;
	box-sizing: border-box;
	background: transparent;
	border: none;
	font-size: 12pt;
	float: right;
	color: #fff;
	border-bottom: 1px solid transparent;
	-webkit-transition: all 0.55s ease;
	-moz-transition: all 0.55s ease;
	-ms-transition: all 0.55s ease;
	-o-transition: all 0.55s ease;
	transition: all 0.55s ease;
}

.container-2 input#search::-webkit-input-placeholder {
	color: #65737e;
}

.container-2 input#search:-moz-placeholder {
	/* Firefox 18- */
	color: #65737e;
}

.container-2 input#search::-moz-placeholder {
	/* Firefox 19+ */
	color: #65737e;
}

.container-2 input#search:-ms-input-placeholder {
	color: #65737e;
}

.container-2 .icon {
	position: absolute;
	right: 0;
	color: white;
	width: 35px;
	height: 35px;
	font-size: 1rem;
	-webkit-border-radius: 5px;
	-moz-border-radius: 5px;
	border-radius: 5px;
	background: transparent;
}

.container-2 .icon i::before {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
}

.container-2 input#search:focus,
.container-2 input#search:active {
	outline: none;
	width: 250px;
	padding-right: 35px;
	border-bottom: 1px solid white;
}

.container-2:hover input#search {
	width: 250px;
	padding-right: 35px;
	border-bottom: 1px solid white;
}

.container-2:hover .icon {
	color: white;
}
</style>
