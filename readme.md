# Simple-SQL-lexer
## The why part
The porpouse of this project is to create a simple lexer for an even more simple and restricted SQL, just for learning porpouses.
## What is a Lexer
In a compiler design, almost everytime, the first step is a so called "lexical analysis". It consists of trasnforming a string of simple characters into a sequence of meaningfull entities called "Tokens". These are like the building blocks for an underlying language, in this case SQL. A lexer is a part of software that makes this happen.
## Implementation
In this case I will be implementig a SQL (simplified) lexer. This will be a so called hand coded implementation of the lexer. It means it is a language specific and not a Lexer tool like Alex/Jlex/Flex which are generic lexer generators which require a token definitions based on regular expressions to create a lexer for any language.
### Token types and lexeme
As I already mentioned, a Token is a sequence of characters. This sequence is called "lexeme". Some Tokens have a fixed lexeme, for example, Token for add operator has a lexeme "+", which is same for all Tokens of this type. On the other hand, there are Tokens that have different lexeme altough beying of same type. For example 'identifier' Token can have any lexeme starting with alphabetic character folowed by any number of alpha/numeric characters. So to 'identifiers' "id" and "counter", for example, belong to same type of Token, but have different lexeme. 
Different Token types admit different set of characters and can have some specific restriction concerning placement of this chars in the lexeme. In this implementation I will use a class **TokenT** as a base class for all other Token types. For the Token Types that have a fixed lexeme I will use a class **ReservedT** which will be derived from **TokenT** class. The main difference concerning this lexeme issue is that **ReservedT** will have a property called **value** which is requiered in a constructor and represents the fixed lexeme of this Token type. 
On the other side, the token types that do not have lexeme defined by Token type are: 'identifier', 'number', 'string' which will be represented by classes **IdT**, **NumberT**, **StringT** respectivly. Each of this classes will implement a method called **validChar (char,pos)** which checks specific restrictions based on char type and position in a Token. Some aditional checking might be requiered based on characters preceeding the current one. These will be described later.
### How Tokens are recognized
The input string is read char by char, feeding each one to the lexer which tries to match it with different existing Tokens lexems definitions. Normally this works similarlly to a Finite State Automatha (FSA) by transitionning between states till reaching an error or accepting state. Each token recognized by a Lexer has it's own FSA and all are feeded with an incomming character from the string in sequence or parallel. In this implementation the FSA for each token type, will be represented by a class called **TokenTmatcher** which will hold information about the token type which is supposed to be matched, state (error/acceptance), a method **input(char,pos)** for processing an incomming char and a stack, holding valid characters matched so far.
The procedure is based on so called 'longer token possible' matching strategy. What it means is that, for example, if we had a string like "select * from selection" the "selection" part would be matched as IdT instead of 'select' token folowed by 'ion' IdT. The way this is implemented is as follows: in the matching loop of a lexer there is a variable named **activeMatchers** which holds the TokenTmatchers which are not in error state. When a new caracter is fed, we check if there is at least one TokenTmatcher in activeMatchers. If there are, we check how many of them are in acceptance state and save them in a variable acceptingMatchers. If there are no active matchers, we check if there are acceptingMatchers saved from before. If there are, we select one with highest priority an emit the Token it is matching. If there are no active matchers, it means a syntax error. In a case when a character is not white space and a Token was emited, a step back is requiered for restarting matching process.
### Aditional character checks
Some aditional checking is performed in TokenTmatcher based on current stack contents. For example, in TokenTmatcher for StringT we check if current character is a '\\'', and if a position in a token is not 0, it means we need to end the string here. So FSA saves character in the stack and accepts. Any farther character will cause FSA to go to an error state. In a NumberT matcher, we check if '.' character already exist in a stack. If so, FSA goes to error state, since only one '.' character is alowed in a Number.
## Available for this simplified SQL
The available Tokens are defined in **available_tokens.js**. If this lexer is used on it's own, there is no problem to adding any new definition to this file, since lexer is based on this file. But if you try to use it together with a syntatctic parser, which I add soon, it is necesary to add rule definitions into **rules.grm** for this new Tokens for all to work properlly
## Try it out
There is an **lexer_try_it_out.js** file where you can try this lexer with any query to see the working
