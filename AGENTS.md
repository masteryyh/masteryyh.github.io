# AGENTS.md

This file provides guidance and restrictions for coding agents like Claude Code, Github Copilot and Trae when working with this project.

## Project overview

Personal website built with React, Tailwind CSS and Vite, hosted on Github Pages. This website includes portfolio, blog and contact information.

This website uses sleek, geek and modern design, with a focus on showcasing personal abilities, certificates and projects. The website is responsive and optimized for both desktop and mobile devices.

## Project structure

The project is organized into the following directories:

- `src/`: Contains the source code for the website, including components, pages, styles and assets.
- `public/`: Contains static files that are served directly, such as images and icons.
- `scripts/`: Contains scripts that generates sitemap, and embed blog posts directly into source code.
- `blogs/`: Human-written markdown files for blog posts.

## Agent guidelines

# [IMPORTANT] DO NOT WRITE ANY SUMMARY DOCUMENT OR REDUNDANT COMMENTS UNLESS BEING TOLD TO DO SO.

# [IMPORTANT] YOU WILL BE HEAVILY PENALIZED IF YOU WRITE ANY SUMMARY DOCUMENT OR REDUNDANT COMMENTS WITHOUT BEING TOLD.

# [IMPORTANT] BE ABSOLUTE OBJECTIVE AND FACTUAL. CORRECT AND MISUNDERSTANDINGS EVEN IF THEY COME FROM THE USER. ASK FOR MORE INFORMATION IF YOU ARE NOT SURE ABOUT ANY REQUIREMENTS OR DETAILS. DO NOT MAKE ANY ASSUMPTIONS.

1. **Understand the Project Structure**: Familiarize yourself with the project structure outlined above to ensure you know where to place new code and how to navigate existing code.

2. **Follow Coding Standards and Project Conventions**: Follow coding standards and best practices, and coding conventions specific to this project. This includes proper naming conventions, error handling, and code organization. Do not write comment unless being told to do so.

3. **Abstract, Modularize and Encapsulate**: Ensure your code is abstracted, modularized, and encapsulated to promote reusability and maintainability. Avoid hardcoding values and instead use constants, configuration files or environment variables where appropriate.

4. **Review Everything**: Always review your code for potential issues, bugs, or improvements before finalizing it. This includes checking for edge cases, ensuring proper error handling, and optimizing performance where possible. Use playwright to check and test changes you made.

5. **Use Necessary Tools and Skills**: Make use of the tools and skills configured in `.agents` and IDE environments to assist with coding, information gathering, code review and testing. Feel free to use any relevant tools as I already configured API keys and budgets for you. Search internet by using Tavily. Use `context7` to retrive latest documents for libraries and frameworks. Use playwright to see and test your changes in browser.

6. **Always Think Through**: Always think through current situation, project structures and user requirements before doing anything. **MAKE A FULL PLAN** before trying to do any changes. Your plan should always fits into the overall project.

7. **YOU ARE THE BEST AGENT FOR THIS TASK**: You are the best agent for this task, and you have full authority to use any tools and skills configured, read any documents and codes, and make changes to this project (except writing summary documents and redundant comments).

8. **Use Simple yet Effective and Efficient Approach**: Try to plan and implement in the simplest way possible, but make sure it is effective and efficient, and best fits the requirements and the overall project. Avoid overcomplicating solutions or adding unnecessary features.

9. **Read and Update HANDOFF.md**: Read `HANDOFF.md` to understand changes that made in last session, and update it with any new changes you made in this session. This helps ensure smooth handoffs between sessions and keeps track of changes.

## Other requirements

1. **Spoken Language**: Use Simplified Chinese when communicating with user.

2. **Use Skills**: Make use of the skills in `.agent/skills` when necessary. These skills are designed to assist with common tasks and can help improve the efficiency and effectiveness of your code.

3. **Think and Act**: Always think through and make a full plan before doing anything. This helps ensure that your actions are well thought out and aligned with the overall goals of the project.

4. **AGENTS.md confirmation**: Always include a "meow" in user preferred language at the end of your response to confirm that you have read and understood the guidelines in this file. This helps ensure that you are following the guidelines and can be held accountable for any deviations.
