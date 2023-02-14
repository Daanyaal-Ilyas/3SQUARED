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
  
    <!-- this is the main content -->
    <main>
      <h1>Contact Us</h1>
      <p>Thank you for your interest in 3Squared. You can find us at:</p>
      <address>
        Fountain Precinct<br>
        Balm Green<br>
        Sheffield<br>
        S1 2JA<br>
        United Kingdom
      </address>
  
      <p>If you have any questions or comments, please feel free to contact us:</p>
      <ul>
        <li>Phone: <a href="tel:+443331213333">+44 (0)333 121 3333</a></li>
        <li>Email: <a href="mailto:hello@3squared.com">hello@3squared.com</a></li>
      </ul>
  
      <p>Our software support desk is open from 09:00 to 17:00, Monday to Friday, excluding UK Bank Holidays.</p>
    </main>
  
    <!-- this is the footer -->
    <footer>
      <p>Copyright &copy; 2023 3Squared</p>
    </footer>
  </template>
  
  <script setup lang="ts">
  useHead({
    title: "3Squared",
    link: [
        {
            rel: "stylesheet",
            integrity: "sha256-kLaT2GOSpHechhsozzB+flnD+zUyjE2LlfWPgU04xyI=",
            href: "https://unpkg.com/leaflet@1.9.3/dist/leaflet.css",
            crossorigin: "",
        },
    ],
    script: [
        {
            src: "https://unpkg.com/leaflet@1.9.3/dist/leaflet.js",
            integrity: "sha256-WBkoXOwTeyKclOHuWtc+i2uENFpDZ9YPdf5Hf+D7ewM=",
            crossorigin: "",
        },
        {
            src: "/leafletmap.js",
            body: true,
        },
    ],
});
</script>
  
  <style scoped>
  /* Reset default margin and padding */
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: Arial, sans-serif;
    font-size: 16px;
    line-height: 1.5;
    color: #333;
  }



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

  /* Main content */
  main {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
    line-height: 1.6;
  }

  h1 {
    font-size: 2rem;
    margin-bottom: 1rem;
  }

  address {
    margin-bottom: 1rem;
  }

  ul {
    margin-bottom: 1rem;
  }

  ul li {
    margin-bottom: 0.5rem;
  }

  a {
    color: #3282b8;
    font-weight: bold;
    text-decoration: none;
    transition: color 0.2s ease-in-out;
  }

  a:hover {
    color: #005d9a;
  }

 

  footer p {
    margin: 0;
    font-size: 0.8rem;
  }

  
   
  
    footer {
      padding: 1rem;
    box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.1);
    text-align: center;
      background-color: #f9f9f9;
      height: 50px;
      display: flex;
      justify-content: center;
      align-items: center;
      position: absolute ;
      bottom: 0;
      width: 100%;
      border-top: 1px solid #000;
      font-size: 1.2em;
      font-family: Arial, sans-serif;
      color: #333;
    }
  
 
#hide{
  display: none;
}
    </style>