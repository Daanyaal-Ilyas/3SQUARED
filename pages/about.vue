<template>
   <header>
        <!-- this is the navbar -->
        <nav>
            <ul>
                <li><a href="/">Home</a></li>
                <li><nuxt-link to="/about">About</nuxt-link></li>
                <li><nuxt-link to="/contact">Contact</nuxt-link></li>
            </ul>
        </nav>
    </header>


   

    <!-- this is the footer -->
    <footer>
        <p>Copyright &copy; 2023 3Squared</p>
    </footer>

</template>

<script setup lang="ts">

useHead({
    title: "3Squared",
    
        },
    
);


</script>

<style scoped>
#header{
    font-size: 24px;
}
button {
  background: none;
  border: none;
  padding: 0;
  font-size: inherit;
  color: inherit;
  cursor: pointer;
  margin-right: 10px;
  text-decoration: none;
  position: relative;
}

button::after {
  content: '';
  display: block;
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0%;
  height: 2px;
  background-color: black;
  transition: width 0.2s ease-in-out;
}

button:hover::after {
  width: 100%;
}

    footer {
      background-color: #f9f9f9;
      height: 50px;
      display: flex;
      justify-content: center;
      align-items: center;
      position: absolute;
      bottom: 0;
      width: 100%;
      border-top: 1px solid #000;
      font-size: 1.2em;
      font-family: Arial, sans-serif;
      color: #333;
    }

/*test */

/*Sidebar*/ 
#sidebar {
    width: 200px;
    background-color: #e6f0f5;
    float: left;
    padding-left: 20px;
    height: 500px;
    border-right: 4px solid rgb(255, 255, 255);
    display: none;
}

/*map*/ 
#leafletmap {
    height: 500px;
    width: calc(100%-100px);
    float: center;
    padding-left: 20px;
    
}

/*nav*/ 
nav {
    background-color: #f0f5f5;
    height: 60px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 2px solid #3282b8;
    width: 100%;
}

nav a {
    color: #3282b8;
    text-decoration: none;
    font-size: 1.4em;
    margin-right: 20px;
    position: relative;
    transition: all 0.3s ease-in-out;
}

nav ul {
    display: flex;
    list-style: none;
    margin: 0;
    padding: 0;
}

nav li {
    margin: 0 10px;
}


nav a:before {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 2px;
    background-color: #3282b8;
    transform: scaleX(0);
    transform-origin: right;
    transition: transform 0.3s ease-in-out;
}

nav a:hover:before {
    transform: scaleX(1);
    transform-origin: left;
}
</style>