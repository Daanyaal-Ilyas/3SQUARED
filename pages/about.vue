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
      <h1>About Us</h1>
      <p>We are 3Squared!
Make.Change.Work.
Digital innovation in rail is nothing new. But success has often been tactical, partial, temporary or not at all. So it’s not surprising that some stakeholders are difficult to bring on-side. That’s why forward-thinkers need more than just sharp technology. They need partners who are implementation experts, proven to win over sceptical stakeholders and deliver results in the real world of rail.

And they need point solutions designed to grow into larger business answers.

3Squared is the partner who has it all. The ethic, capacity, portfolio and roadmap to deliver success every step of the way.

That’s why we say only 3Squared is truly in the business of client success, and not just software. That’s the 3Squared difference.

Let’s Make.Change.Work.Together.</p>
      
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