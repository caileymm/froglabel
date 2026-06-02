
## ABSTRACT 
This project is an easy to use front-end design for an already existing open source data annotation tool called [Label-Studio](https://labelstud.io/). Our project makes it easy to label audio data through the implementation of keyboard shortcuts and tools to modify the display and annotation settings on the webpage. The front-end accesses the converted audio file from Label-Studio and converts it into a spectrogram. The spectrogram further allows the annotator to precisely identify the location of certain audio frequencies which can futher be used to absorb important information and run analysis on the required data. Once the annotator is done annotating, the data is sent back to label-studio and saved on the website as usual within the project on Label-Studio.  

## ACCESSING THE FILES 

## RUNNING THE PROJECT 
  ### Run locally (for developers):
  1. Open Terminal window 1, run:
      ```bash
        cd Desktop
        git clone https://github.com/caileymm/froglabel-studio.git
        pip install label-studio                   #if already installed then skip this step 
        echo 'export PATH="$HOME/Library/Python/3.9/bin:$PATH''' >> ~/.zshrc source ~/.zshrc
        label-studio start
       ```
  2. Open Terminal window 2, run: 
        ```bash
        npm run dev
        ```
  3. View local host links
  4. Navigate to your Personal Access Token on Label-Studio.
  5. Copy the Access Token.
  6. Paste the Access Token and task number into the login page on the local web page. 
    
  ### Run in browser (for non-developers):
  1. Navigate to this [LINK](https://caileymm.github.io/froglabel-studio/)


## PROJECT WORKFLOW 

## IMPORTANT LINKS
  - [FINAL PRESENTATION](https://docs.google.com/presentation/d/1TOCNL7Rg-TOa_IB5ZToZK-hIDA3hgP1P7RpdjB0QWuo/edit?usp=sharing)
  - [FINAL VIDEO](EnterLinkHere)




