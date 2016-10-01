Hierarchical Circular Layouts
=============
Hierarchical Circular Layouts (HCL) is a novel visualization technique for representing the structure and connectivity in deeply nested trees. HCL was inspired by our ongoing work in creating biological pathway visualizations that enable a range of different visual analytics tasks. Although biological pathways can be thought of as interconnected graph structures, domain experts tend to carve out particular subgraphs of pathways in order to limit their complexity and to focus on the components that are relevant to a particular research problem. For the most part, the representations of these pathways are hierarchical structures.

An important consideration in visualizing biological pathways is clearly showing how particular biological elements influence or are influenced by other elements. That is, it can be necessary to highlight relevant interconnected sub-trees with a particular directionality, while at the same time making sure not to obscure the hierarchical information in the tree. 

This technique supports a range of interactions on this representation, such as collapsing or expanding of node in the hierarchy to simplify or or to fully explore its structure, selecting a connection between two nodes, and highlighting relationships involving an selected item in the hierarchy.


The following figure shows HCL visualization technique for the Activation of Pro-caspase 8 pathway. Blue (leaf) nodes are biochemical reactions within this pathway. Gray nodes are sub-pathways which are stacked directly on the top of parent pathway. We use red links to indicate the causal relationships between nodes (biochemical reactions). Connections of nodes in different sub-trees are wired through the center of their closest common ancestor. This common ancestor for a given set of nodes may be several levels higher than the leaf nodes themselves. In this case, the connections are wired through these intermediate nodes. The idea is similar to threading though the holes (centers) of a chain of buttons (intermediate nodes) to connect two leaf nodes. 
![ScreenShot](http://www.cs.uic.edu/~tdang/HCL/Image1-Activation of Pro-caspase 8 Pathway.png)

The following figure shows causal relationships of biochemical reactions in the ERBB2 pathway which are structured in HCL. The data can be found on Reactome: http://www.reactome.org/PathwayBrowser/#/R-HSA-1227986
![ScreenShot](http://www.cs.uic.edu/~tdang/HCL/Image2-ERBB2 Pathway.png)

The following figure shows another example of HCL (tree structure) and edge bundling (red links) of 292 biochemical reactions in the Signaling by GPCR pathway. The pathway data can be found on Reactome:
http://www.reactome.org/PathwayBrowser/#/R-HSA-372790&PATH=R-HSA-162582
![ScreenShot](http://www.cs.uic.edu/~tdang/HCL/Image3-Signaling to GPCR Pathway.png)

The following figure shows strong causal relationships between 116 biochemical reactions in the NGF Pathway. The data can be found on Reactome:
http://www.reactome.org/PathwayBrowser/#/R-HSA-166520
![ScreenShot](http://www.cs.uic.edu/~tdang/HCL/Image4-NGF Pathway.png)

HCL has applications on many other domains such as security visualization and biodiversity. The following figure shows prey-predator relationships between meat-eating animals in the Carnivora tree. The image of each animal is attached directly to where it appears in the tree.
![ScreenShot](http://www.cs.uic.edu/~tdang/HCL/Image5-Carnivora.png)

The following figure shows a more complicated example of the entire mammal tree. The leaf nodes (mammals) become too small to view without zooming in. A red link connects from predator to a prey. The mammal data is extracted from [OneZoom](http://www.onezoom.org/).
![ScreenShot](http://www.cs.uic.edu/~tdang/HCL/Image6-Mammals.png)


Hierarchical Circular Layouts is implemented in D3 (index.html in this folder) as well as in Processing available at: https://github.com/CreativeCodingLab/PathwayViewer.

This work was funded by the DARPA Big Mechanism Program under ARO contract WF911NF-14-1-0395.










